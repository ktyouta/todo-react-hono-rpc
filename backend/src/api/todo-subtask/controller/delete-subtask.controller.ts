import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain";
import { taskTransaction } from "../../../infrastructure";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { DeleteSubtaskRepository } from "../repository/delete-subtask.repository";
import { SubtaskIdParamSchema } from "../schema/subtask-id-param.schema";
import { DeleteSubtaskService } from "../service/delete-subtask.service";

/**
 * サブタスク論理削除
 * @route DELETE /api/v1/todo/:id/subtasks/:subId
 */
const deleteSubtask = new Hono<AppEnv>().delete(
    API_ENDPOINT.TODO_SUBTASK_ID,
    authMiddleware,
    zValidator("param", SubtaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const userId = c.get("user")?.userId;

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        const { id, subId } = c.req.valid("param");
        const parentTaskId = new TaskId(id);
        const subtaskId = new TaskId(subId);

        const repository = new DeleteSubtaskRepository(db);
        const service = new DeleteSubtaskService(repository);
        const subtask = await service.find(userId, parentTaskId, subtaskId);

        if (!subtask) {
            return c.json({ message: "削除対象のサブタスクが存在しません。" }, HTTP_STATUS.NOT_FOUND);
        }

        const now = new Date().toISOString();

        await db.batch([
            db.update(taskTransaction)
                .set({ updatedAt: now, deleteFlg: true })
                .where(
                    and(
                        eq(taskTransaction.id, subtaskId.value),
                        eq(taskTransaction.parentId, parentTaskId.value),
                        eq(taskTransaction.userId, userId.value),
                        eq(taskTransaction.deleteFlg, false),
                    )
                ),
        ]);

        return c.json({ message: "サブタスクを削除しました。" }, HTTP_STATUS.OK);
    }
);

export { deleteSubtask };
