import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { RoleId } from "../../../domain";
import { authMiddleware, requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { BulkUpdateUserManagementRoleRepository } from "../repository/bulk-update-user-management-role.repository";
import { BulkUpdateUserManagementRoleSchema } from "../schema/bulk-update-user-management-role.schema";
import { BulkUpdateUserManagementRoleService } from "../service/bulk-update-user-management-role.service";

/**
 * ユーザー一括ロール変更（管理者用）
 * @route PATCH /api/v1/user-management/bulk/role
 */
const bulkUpdateUserManagementRole = new Hono<AppEnv>().patch(
    API_ENDPOINT.USER_MANAGEMENT_BULK_ROLE,
    authMiddleware,
    requirePermission("user_management"),
    zValidator("json", BulkUpdateUserManagementRoleSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "バリデーションエラー", data: formatZodErrors(result.error) }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const { ids, roleId: roleIdValue } = c.req.valid("json");
        const loginUserId = c.get("user")?.userId.value;
        const roleId = RoleId.of(roleIdValue);
        const repository = new BulkUpdateUserManagementRoleRepository(db);
        const service = new BulkUpdateUserManagementRoleService(repository);

        // 自己ロール降格ガード：変更後のロールにuser_management権限がない場合は自己降格させない
        if (loginUserId !== undefined && ids.includes(loginUserId)) {
            const permissions = await service.getRolePermission(roleId);

            if (!permissions.includes("user_management")) {
                return c.json({ message: "管理権限のないロールに自身のロールを変更することはできません。" }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
            }
        }

        // ロール更新
        await service.updateRoles(ids, roleId);

        return c.json({ message: "ロールを一括更新しました。" }, HTTP_STATUS.OK);
    }
);

export { bulkUpdateUserManagementRole };
