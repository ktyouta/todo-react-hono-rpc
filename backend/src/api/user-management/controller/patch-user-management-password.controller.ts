import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { FrontUserId, FrontUserPassword, FrontUserSalt, Pepper } from "../../../domain";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { PatchUserManagementPasswordRepository } from "../repository/patch-user-management-password.repository";
import { PatchUserManagementPasswordSchema } from "../schema/patch-user-management-password.schema";
import { UserManagementIdParamSchema } from "../schema/user-management-id-param.schema";
import { PatchUserManagementPasswordService } from "../service/patch-user-management-password.service";

/**
 * パスワードリセット（管理者用）
 * @route PATCH /api/v1/user-management/:id/password
 */
const patchUserManagementPassword = new Hono<AppEnv>().patch(
    API_ENDPOINT.USER_MANAGEMENT_PASSWORD,
    requirePermission("user_management"),
    zValidator("param", UserManagementIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    zValidator("json", PatchUserManagementPasswordSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "バリデーションエラー", data: formatZodErrors(result.error) }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const config = c.get("envConfig");
        const userId = FrontUserId.of(c.req.valid("param").id);
        const { newPassword } = c.req.valid("json");

        const repository = new PatchUserManagementPasswordRepository(db);
        const service = new PatchUserManagementPasswordService(repository);

        const loginInfo = await service.getLoginUser(userId);

        if (!loginInfo) {
            return c.json({ message: "ユーザーが見つかりません。" }, HTTP_STATUS.NOT_FOUND);
        }

        const pepper = new Pepper(config.pepper);
        const salt = FrontUserSalt.of(loginInfo.salt);
        const hashedPassword = await FrontUserPassword.hash(newPassword, salt, pepper);

        const updated = await service.updatePassword(userId, hashedPassword);

        if (!updated) {
            return c.json({ message: "パスワードの更新に失敗しました。" }, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        return c.json({ message: "パスワードをリセットしました。" }, HTTP_STATUS.OK);
    }
);

export { patchUserManagementPassword };
