import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { FrontUserId } from "../../../domain";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetUserManagementRepository } from "../repository/get-user-management.repository";
import { UserManagementIdParamSchema } from "../schema/user-management-id-param.schema";
import { GetUserManagementService } from "../service/get-user-management.service";

/**
 * ユーザー詳細取得（管理者用）
 * @route GET /api/v1/user-management/:id
 */
const getUserManagement = new Hono<AppEnv>().get(
    API_ENDPOINT.USER_MANAGEMENT_ID,
    requirePermission("user_management"),
    zValidator("param", UserManagementIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const userId = FrontUserId.of(c.req.valid("param").id);
        const repository = new GetUserManagementRepository(db);
        const service = new GetUserManagementService(repository);

        const user = await service.find(userId);

        if (!user) {
            return c.json({ message: "Not Found", data: user }, HTTP_STATUS.NOT_FOUND);
        }

        return c.json({ message: "ユーザーを取得しました。", data: user }, HTTP_STATUS.OK);
    }
);

export { getUserManagement };
