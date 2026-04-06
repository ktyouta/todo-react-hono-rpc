import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { taskTransaction } from "../../../infrastructure";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { BulkRestoreTodoSchema } from "../schema/bulk-restore-todo-deleted";

/**
 * 削除済みタスク一括復元（管理者用）
 * @route PATCH /api/v1/todo-deleted/bulk/restore
 */
const restoreTodoDeletedBulk = new Hono<AppEnv>().patch(
    API_ENDPOINT.TODO_DELETED_BULK_RESTORE,
    requirePermission("deleted_task_management"),
    zValidator("json", BulkRestoreTodoSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "バリデーションエラー", data: formatZodErrors(result.error) }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const { ids } = c.req.valid("json");
        const now = new Date().toISOString();

        await db.batch([
            db.update(taskTransaction)
                .set({
                    updatedAt: now,
                    deleteFlg: false,
                })
                .where(
                    and(
                        inArray(taskTransaction.id, ids),
                        eq(taskTransaction.deleteFlg, true)
                    )
                ),
        ]);

        return c.json({ message: "タスクを復元しました。" }, HTTP_STATUS.OK);
    }
);

export { restoreTodoDeletedBulk };
