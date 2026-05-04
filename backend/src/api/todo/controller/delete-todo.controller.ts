import { zValidator } from "@hono/zod-validator";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain";
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

        await db.run(sql`
            WITH RECURSIVE descendants(id) AS (
                SELECT id FROM task_transaction WHERE id = ${taskId.value}
                UNION ALL
                SELECT t.id FROM task_transaction t
                INNER JOIN descendants d ON t.parent_id = d.id
                WHERE t.delete_flg = 0
            )
            UPDATE task_transaction
            SET delete_flg = 1, updated_at = ${now}
            WHERE id IN (SELECT id FROM descendants)
            AND delete_flg = 0
            AND user_id = ${userId.value}
        `);

        return c.json({ message: "タスクを削除しました。" }, HTTP_STATUS.OK);
    }
);

export { deleteTodo };

