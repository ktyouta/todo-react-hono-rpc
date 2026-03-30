import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetRoleManagementRepository } from "../repository/get-role-management.repository";
import { RoleManagementIdParamSchema } from "../schema/role-management-id-param.schema";
import { GetRoleManagementService } from "../service/get-role-management.service";

/**
 * ロール詳細取得（管理者用）
 * @route GET /api/v1/role-management/:roleId
 */
const getRoleManagement = new Hono<AppEnv>().get(
    API_ENDPOINT.ROLE_MANAGEMENT_ID,
    requirePermission("role_management"),
    zValidator("param", RoleManagementIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const { roleId } = c.req.valid("param");
        const repository = new GetRoleManagementRepository(db);
        const service = new GetRoleManagementService(repository);

        const role = await service.findRole(roleId);
        if (!role) {
            return c.json({ message: "ロールが見つかりません。" }, HTTP_STATUS.NOT_FOUND);
        }

        const permissions = await service.findPermissions(roleId);
        return c.json({ message: "ロールを取得しました。", data: { ...role, permissions } }, HTTP_STATUS.OK);
    }
);

export { getRoleManagement };
