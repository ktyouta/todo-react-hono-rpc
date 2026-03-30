import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { roleMaster, rolePermission } from "../../../infrastructure/db";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { UpdateRoleManagementRepository } from "../repository/update-role-management.repository";
import { RoleManagementIdParamSchema } from "../schema/role-management-id-param.schema";
import { UpdateRoleManagementSchema } from "../schema/update-role-management.schema";

/**
 * ロール更新（管理者用）
 * @route PUT /api/v1/role-management/:roleId
 */
const updateRoleManagement = new Hono<AppEnv>().put(
    API_ENDPOINT.ROLE_MANAGEMENT_ID,
    requirePermission("role_management"),
    zValidator("param", RoleManagementIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    zValidator("json", UpdateRoleManagementSchema, (result, c) => {
        if (!result.success) {
            const data = formatZodErrors(result.error);
            const message = data.map((e) => e.message);
            return c.json({ message, data }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const { roleId } = c.req.valid("param");
        const body = c.req.valid("json");
        const db = c.get("db");
        const repository = new UpdateRoleManagementRepository(db);

        // ロール存在チェック
        const role = await repository.findById(roleId);
        if (!role) {
            return c.json({ message: "ロールが見つかりません。" }, HTTP_STATUS.NOT_FOUND);
        }

        // ロール名重複チェック（自身を除く）
        const nameConflict = await repository.findByNameExcludingId(body.name, roleId);
        if (nameConflict.length > 0) {
            return c.json({ message: "既に同じ名前のロールが存在しています。" }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }

        const now = new Date().toISOString();

        await db.batch([
            db.update(roleMaster)
                .set({ name: body.name, updatedAt: now })
                .where(eq(roleMaster.id, roleId)),
            db.delete(rolePermission)
                .where(eq(rolePermission.roleId, roleId)),
            ...body.permissionIds.map((permissionId) =>
                db.insert(rolePermission).values({
                    roleId,
                    permissionId,
                })
            ),
        ]);

        return c.json({ message: "ロールを更新しました。", data: { id: roleId, name: body.name, updatedAt: now } }, HTTP_STATUS.OK);
    }
);

export { updateRoleManagement };
