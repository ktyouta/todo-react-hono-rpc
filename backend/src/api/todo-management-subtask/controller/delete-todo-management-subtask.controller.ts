import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain";
import { taskTransaction } from "../../../infrastructure";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { SubtaskIdParamSchema } from "../schema/subtask-id-param.schema";

/**
 * サブタスク論理削除（管理者用）
 * @route DELETE /api/v1/todo-management/:id/subtasks/:subId
 */
const deleteTodoManagementSubtask = new Hono<AppEnv>().delete(
    API_ENDPOINT.TODO_MANAGEMENT_SUBTASK_ID,
    requirePermission("task_management"),
    zValidator("param", SubtaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const { id, subId } = c.req.valid("param");
        const parentTaskId = new TaskId(id);
        const subtaskId = new TaskId(subId);
        const now = new Date().toISOString();

        await db.batch([
            db.update(taskTransaction)
                .set({ updatedAt: now, deleteFlg: true })
                .where(
                    and(
                        eq(taskTransaction.id, subtaskId.value),
                        eq(taskTransaction.parentId, parentTaskId.value),
                        eq(taskTransaction.deleteFlg, false),
                    )
                ),
        ]);

        return c.json({ message: "サブタスクを削除しました。" }, HTTP_STATUS.OK);
    }
);

export { deleteTodoManagementSubtask };
