import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain/task-id";
import { taskTransaction } from "../../../infrastructure";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { TaskIdParamSchema } from "../../todo-deleted/schema/task-id-param.schema";

/**
 * 削除済みタスク復元（管理者用）
 * @route PATCH /api/v1/todo-deleted/:id/restore
 */
const restoreTodoDeleted = new Hono<AppEnv>().patch(
    API_ENDPOINT.TODO_DELETED_RESTORE,
    requirePermission("deleted_task_management"),
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const taskId = new TaskId(c.req.valid("param").id);
        const now = new Date().toISOString();

        await db.batch([
            db.update(taskTransaction)
                .set({
                    updatedAt: now,
                    deleteFlg: false,
                })
                .where(
                    and(
                        eq(taskTransaction.id, taskId.value),
                        eq(taskTransaction.deleteFlg, true)
                    )
                ),
        ]);

        return c.json({ message: "タスクを復元しました。" }, HTTP_STATUS.OK);
    }
);

export { restoreTodoDeleted };
