import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain/task-id";
import { taskTransaction } from "../../../infrastructure";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { TaskIdParamSchema } from "../schema/task-id-param.schema";

/**
 * 削除済みタスク物理削除（管理者用）
 * @route DELETE /api/v1/todo-deleted/:id
 */
const deleteTodoDeleted = new Hono<AppEnv>().delete(
    API_ENDPOINT.TODO_DELETED_ID,
    requirePermission("deleted_task_management"),
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const taskId = new TaskId(c.req.valid("param").id);

        await db.batch([
            db.delete(taskTransaction)
                .where(
                    and(
                        eq(taskTransaction.id, taskId.value),
                        eq(taskTransaction.deleteFlg, true)
                    )
                ),
        ]);

        return c.json({ message: "タスクを完全に削除しました。" }, HTTP_STATUS.OK);
    }
);

export { deleteTodoDeleted };
