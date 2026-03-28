import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { FrontUserId } from "../../../domain";
import { frontUserLoginMaster, frontUserMaster } from "../../../infrastructure/db";
import { authMiddleware, requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { DeleteUserManagementRepository } from "../repository/delete-user-management.repository";
import { UserManagementIdParamSchema } from "../schema/user-management-id-param.schema";
import { DeleteUserManagementService } from "../service/delete-user-management.service";

/**
 * ユーザー削除（論理削除・管理者用）
 * @route DELETE /api/v1/user-management/:id
 */
const deleteUserManagement = new Hono<AppEnv>().delete(
    API_ENDPOINT.USER_MANAGEMENT_ID,
    authMiddleware,
    requirePermission("user_management"),
    zValidator("param", UserManagementIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const targetUserId = FrontUserId.of(c.req.valid("param").id);
        const loginUserId = c.get("user")?.userId;
        const now = new Date().toISOString();

        const repository = new DeleteUserManagementRepository(db);
        const service = new DeleteUserManagementService(repository);

        // 自己削除ガード
        if (targetUserId.value === loginUserId?.value) {
            return c.json({ message: "自身のアカウントは削除できません。" }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }

        // 削除対象ユーザーの存在確認
        const userExists = await service.exists(targetUserId);

        if (!userExists) {
            return c.json({ message: "ユーザーが見つかりません。" }, HTTP_STATUS.NOT_FOUND);
        }

        await db.batch([
            db.update(frontUserMaster)
                .set({ deleteFlg: true, updatedAt: now })
                .where(
                    and(
                        eq(frontUserMaster.id, targetUserId.value),
                        eq(frontUserMaster.deleteFlg, false)
                    )
                ),
            db.update(frontUserLoginMaster)
                .set({ deleteFlg: true, updatedAt: now })
                .where(
                    and(
                        eq(frontUserLoginMaster.id, targetUserId.value),
                        eq(frontUserLoginMaster.deleteFlg, false)
                    )
                ),
        ]);

        return c.json({ message: "ユーザーを削除しました。" }, HTTP_STATUS.OK);
    }
);

export { deleteUserManagement };
