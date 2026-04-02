import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { roleMaster, rolePermission } from "../../../infrastructure/db";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { DeleteRoleManagementRepository } from "../repository/delete-role-management.repository";
import { RoleManagementIdParamSchema } from "../schema/role-management-id-param.schema";
import { DeleteRoleManagementService } from "../service/delete-role-management.service";

/**
 * ロール削除（管理者用）
 * @route DELETE /api/v1/role-management/:roleId
 */
const deleteRoleManagement = new Hono<AppEnv>().delete(
    API_ENDPOINT.ROLE_MANAGEMENT_ID,
    requirePermission("role_management"),
    zValidator("param", RoleManagementIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const { roleId } = c.req.valid("param");
        const db = c.get("db");
        const repository = new DeleteRoleManagementRepository(db);
        const service = new DeleteRoleManagementService(repository);

        // ロール存在チェック
        const role = await service.findRole(roleId);
        if (!role) {
            return c.json({ message: "ロールが見つかりません。" }, HTTP_STATUS.NOT_FOUND);
        }

        // 保護対象のロールについては削除不可
        if (role.isProtected) {
            return c.json({ message: "保護対象ロールのため削除できません" }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }

        // 削除対象ロールの使用チェック
        const user = await service.checkExistUser(roleId);
        if (user.length > 0) {
            return c.json({ message: "対象のロールを使用中のユーザーが存在します。" }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }

        await db.batch([
            // ロールパーミッションテーブル
            db.delete(rolePermission)
                .where(eq(rolePermission.roleId, roleId)),
            // ロールマスタ
            db.delete(roleMaster)
                .where(eq(roleMaster.id, roleId))
        ]);

        return c.json({ message: "ロールを削除しました。" }, HTTP_STATUS.OK);
    }
);

export { deleteRoleManagement };
