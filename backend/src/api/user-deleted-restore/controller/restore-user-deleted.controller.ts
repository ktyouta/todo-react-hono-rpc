import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { FrontUserId } from "../../../domain";
import { frontUserLoginMaster, frontUserMaster, taskTransaction } from "../../../infrastructure/db";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { UserDeletedIdParamSchema } from "../../user-deleted/schema/user-deleted-id-param.schema";

/**
 * 削除済みユーザー復元（管理者用）
 * @route PATCH /api/v1/user-deleted/:id/restore
 */
const restoreUserDeleted = new Hono<AppEnv>().patch(
    API_ENDPOINT.USER_DELETED_RESTORE,
    requirePermission("deleted_user_management"),
    zValidator("param", UserDeletedIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const targetUserId = FrontUserId.of(c.req.valid("param").id);
        const now = new Date().toISOString();

        await db.batch([
            db.update(frontUserMaster)
                .set({
                    updatedAt: now,
                    deleteFlg: false,
                })
                .where(
                    and(
                        eq(frontUserMaster.id, targetUserId.value),
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
                        eq(frontUserLoginMaster.id, targetUserId.value),
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
                        eq(taskTransaction.userId, targetUserId.value),
                        eq(taskTransaction.deleteFlg, true)
                    )
                ),
        ]);

        return c.json({ message: "ユーザーを復元しました。" }, HTTP_STATUS.OK);
    }
);

export { restoreUserDeleted };
