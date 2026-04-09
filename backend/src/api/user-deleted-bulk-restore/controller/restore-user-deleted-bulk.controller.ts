import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { frontUserLoginMaster, frontUserMaster, taskTransaction } from "../../../infrastructure/db";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { BulkRestoreUserDeletedSchema } from "../schema/bulk-restore-user-deleted.schema";

/**
 * 削除済みユーザー一括復元（管理者用）
 * @route PATCH /api/v1/user-deleted/bulk/restore
 */
const restoreUserDeletedBulk = new Hono<AppEnv>().patch(
    API_ENDPOINT.USER_DELETED_BULK_RESTORE,
    requirePermission("deleted_user_management"),
    zValidator("json", BulkRestoreUserDeletedSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "バリデーションエラー", data: formatZodErrors(result.error) }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const { ids } = c.req.valid("json");
        const now = new Date().toISOString();

        await db.batch([
            db.update(frontUserMaster)
                .set({
                    updatedAt: now,
                    deleteFlg: false,
                })
                .where(
                    and(
                        inArray(frontUserMaster.id, ids),
                        eq(frontUserMaster.deleteFlg, true)
                    )
                ),
            db.update(frontUserLoginMaster)
                .set({
                    updatedAt: now,
                    deleteFlg: false,
                })
                .where(
                    and(
                        inArray(frontUserLoginMaster.id, ids),
                        eq(frontUserLoginMaster.deleteFlg, true)
                    )
                ),
            db.update(taskTransaction)
                .set({
                    updatedAt: now,
                    deleteFlg: false,
                })
                .where(
                    and(
                        inArray(taskTransaction.userId, ids),
                        eq(taskTransaction.deleteFlg, true)
                    )
                ),
        ]);

        return c.json({ message: "ユーザーを復元しました。" }, HTTP_STATUS.OK);
    }
);

export { restoreUserDeletedBulk };
