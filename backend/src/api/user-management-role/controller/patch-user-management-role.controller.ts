import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { FrontUserId, RoleId } from "../../../domain";
import { authMiddleware, requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { UserManagementIdParamSchema } from "../../user-management/schema/user-management-id-param.schema";
import { PatchUserManagementRoleRepository } from "../repository/patch-user-management-role.repository";
import { PatchUserManagementRoleSchema } from "../schema/patch-user-management-role.schema";
import { PatchUserManagementRoleService } from "../service/patch-user-management-role.service";

/**
 * ロール変更（管理者用）
 * @route PATCH /api/v1/user-management/:id/role
 */
const patchUserManagementRole = new Hono<AppEnv>().patch(
    API_ENDPOINT.USER_MANAGEMENT_ROLE,
    authMiddleware,
    requirePermission("user_management"),
    zValidator("param", UserManagementIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    zValidator("json", PatchUserManagementRoleSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "バリデーションエラー", data: formatZodErrors(result.error) }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const targetUserId = FrontUserId.of(c.req.valid("param").id);
        const userId = c.get("user")?.userId;
        const roleId = RoleId.of(c.req.valid("json").roleId);

        const repository = new PatchUserManagementRoleRepository(db);
        const service = new PatchUserManagementRoleService(repository);

        // 自己ロール降格ガード：変更後のロールにuser_management権限がない場合は自己降格を拒否する
        if (targetUserId.value === userId?.value) {
            const userPermission = await service.getRolePermission(roleId);

            if (!userPermission.includes("user_management")) {
                return c.json({ message: "管理権限のないロールに自身のロールを変更することはできません。" }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
            }
        }

        const updated = await service.updateRole(targetUserId, roleId);

        if (!updated) {
            return c.json({ message: "ユーザーが見つかりません。" }, HTTP_STATUS.NOT_FOUND);
        }

        return c.json({ message: "ロールを更新しました。" }, HTTP_STATUS.OK);
    }
);

export { patchUserManagementRole };
