import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { GetRoleManagementListRepository } from "../repository/get-role-management-list.repository";
import { GetRoleManagementListService } from "../service/get-role-management-list.service";

/**
 * ロール一覧取得（管理者用）
 * @route GET /api/v1/role-management
 */
const getRoleManagementList = new Hono<AppEnv>().get(
    API_ENDPOINT.ROLE_MANAGEMENT,
    requirePermission("role_management"),
    async (c) => {
        const db = c.get("db");
        const repository = new GetRoleManagementListRepository(db);
        const service = new GetRoleManagementListService(repository);

        const roles = await service.findAll();
        const permissionRows = await service.findAllPermissions();
        const list = service.mergeRolesWithPermissions(roles, permissionRows);

        return c.json({ message: "ロール一覧を取得しました。", data: list }, HTTP_STATUS.OK);
    }
);

export { getRoleManagementList };
