import { zValidator } from "@hono/zod-validator";
import { and, eq, or } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain/task-id";
import { taskTransaction } from "../../../infrastructure";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { TaskIdParamSchema } from "../schema/task-id-param.schema";

/**
 * タスク削除（論理削除・管理者用）
 * @route DELETE /api/v1/todo-management/:id
 */
const deleteTodoManagement = new Hono<AppEnv>().delete(
    API_ENDPOINT.TODO_MANAGEMENT_ID,
    requirePermission("task_management"),
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
                    deleteFlg: true,
                })
                .where(
                    and(
                        eq(taskTransaction.deleteFlg, false),
                        or(
                            eq(taskTransaction.parentId, taskId.value),
                            eq(taskTransaction.id, taskId.value),
                        )
                    )
                ),
        ]);

        return c.json({ message: "タスクを削除しました。" }, HTTP_STATUS.OK);
    }
);

export { deleteTodoManagement };

