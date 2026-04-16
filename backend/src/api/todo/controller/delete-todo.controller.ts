import { zValidator } from "@hono/zod-validator";
import { and, eq, or } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain";
import { taskTransaction } from "../../../infrastructure";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { DeleteTodoRepository } from "../repository/delete-todo.repository";
import { TaskIdParamSchema } from "../schema/task-id-param.schema";
import { DeleteTodoService } from "../service/delete-todo.service";


/**
 * タスク削除
 * @route DELETE /api/v1/todo
 */
const deleteTodo = new Hono<AppEnv>().delete(
    API_ENDPOINT.TODO_ID,
    authMiddleware,
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get('db');
        const repository = new DeleteTodoRepository(db);
        const service = new DeleteTodoService(repository);
        const taskId = new TaskId(c.req.valid("param").id);
        const userId = c.get("user")?.userId;
        const now = new Date().toISOString();

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        const task = await service.find(userId, taskId);

        if (!task) {
            return c.json({ message: "削除対象のタスクが存在しません。" }, HTTP_STATUS.NOT_FOUND);
        }

        // お気に入りチェック
        if (task.isFavorite) {
            return c.json({ message: "お気に入りのタスクは削除できません。" }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }

        await db.batch([
            db.update(taskTransaction)
                .set({
                    updatedAt: now,
                    deleteFlg: true
                })
                .where(
                    and(
                        or(
                            eq(taskTransaction.id, taskId.value),
                            eq(taskTransaction.parentId, taskId.value)
                        ),
                        eq(taskTransaction.userId, userId.value),
                        eq(taskTransaction.deleteFlg, false)
                    )
                ),
        ]);

        return c.json({ message: "タスクを削除しました。" }, HTTP_STATUS.OK);
    }
);

export { deleteTodo };

