import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { frontUserLoginMaster, frontUserMaster, taskTransaction } from "../../../infrastructure/db";
import { authMiddleware, requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { BulkDeleteUserManagementSchema } from "../schema/bulk-delete-user-management.schema";

/**
 * ユーザー一括削除（管理者用）
 * @route DELETE /api/v1/user-management/bulk
 */
const bulkDeleteUserManagement = new Hono<AppEnv>().delete(
    API_ENDPOINT.USER_MANAGEMENT_BULK,
    authMiddleware,
    requirePermission("user_management"),
    zValidator("json", BulkDeleteUserManagementSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "バリデーションエラー", data: formatZodErrors(result.error) }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const { ids } = c.req.valid("json");
        const loginUserId = c.get("user")?.userId.value;
        const now = new Date().toISOString();

        // 自己削除ガード
        if (loginUserId !== undefined && ids.includes(loginUserId)) {
            return c.json({ message: "選択したユーザーに自分自身が含まれているため削除できません。" }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }

        await db.batch([
            db.update(frontUserMaster)
                .set({ deleteFlg: true, updatedAt: now })
                .where(
                    and(
                        eq(frontUserMaster.deleteFlg, false),
                        inArray(frontUserMaster.id, ids)
                    )
                ),
            db.update(frontUserLoginMaster)
                .set({ deleteFlg: true, updatedAt: now })
                .where(
                    and(
                        eq(frontUserLoginMaster.deleteFlg, false),
                        inArray(frontUserLoginMaster.id, ids)
                    )
                ),
            db.update(taskTransaction)
                .set({ deleteFlg: true, updatedAt: now })
                .where(
                    and(
                        eq(taskTransaction.deleteFlg, false),
                        inArray(taskTransaction.userId, ids)
                    )
                ),
        ]);

        return c.json({ message: "ユーザーを一括削除しました。" }, HTTP_STATUS.OK);
    }
);

export { bulkDeleteUserManagement };
