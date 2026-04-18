import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray, or } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { taskTransaction } from "../../../infrastructure";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { BulkRestoreTodoTrashSchema } from "../schema/bulk-restore-todo-trash.schema";

/**
 * ゴミ箱タスク一括復元（一般ユーザー用）
 * @route PATCH /api/v1/todo/trash/bulk/restore
 */
const restoreTodoTrashBulk = new Hono<AppEnv>().patch(
    API_ENDPOINT.TODO_TRASH_BULK_RESTORE,
    authMiddleware,
    zValidator("json", BulkRestoreTodoTrashSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "バリデーションエラー", data: formatZodErrors(result.error) }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const userId = c.get("user")?.userId;
        const { ids } = c.req.valid("json");

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        await db.batch([
            db.update(taskTransaction)
                .set({
                    updatedAt: new Date().toISOString(),
                    deleteFlg: false,
                })
                .where(
                    and(
                        or(
                            inArray(taskTransaction.id, ids),
                            inArray(taskTransaction.parentId, ids),
                        ),
                        eq(taskTransaction.deleteFlg, true),
                        eq(taskTransaction.userId, userId.value),
                    )
                ),
        ]);

        return c.json({ message: "タスクを復元しました。" }, HTTP_STATUS.OK);
    }
);

export { restoreTodoTrashBulk };
