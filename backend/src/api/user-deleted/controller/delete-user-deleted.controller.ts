import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { FrontUserId } from "../../../domain";
import { frontUserLoginMaster, frontUserMaster, taskTransaction } from "../../../infrastructure/db";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { UserDeletedIdParamSchema } from "../schema/user-deleted-id-param.schema";

/**
 * 削除済みユーザー物理削除（管理者用）
 * @route DELETE /api/v1/user-deleted/:id
 */
const deleteUserDeleted = new Hono<AppEnv>().delete(
    API_ENDPOINT.USER_DELETED_ID,
    requirePermission("deleted_user_management"),
    zValidator("param", UserDeletedIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const targetUserId = FrontUserId.of(c.req.valid("param").id);

        await db.batch([
            db.delete(taskTransaction)
                .where(
                    eq(taskTransaction.userId, targetUserId.value)
                ),
            db.delete(frontUserLoginMaster)
                .where(
                    eq(frontUserLoginMaster.id, targetUserId.value)
                ),
            db.delete(frontUserMaster)
                .where(
                    and(
                        eq(frontUserMaster.id, targetUserId.value),
                        eq(frontUserMaster.deleteFlg, true)
                    )
                ),
        ]);

        return c.json({ message: "ユーザーを完全に削除しました。" }, HTTP_STATUS.OK);
    }
);

export { deleteUserDeleted };
