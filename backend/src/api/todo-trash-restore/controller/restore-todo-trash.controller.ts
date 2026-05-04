import { zValidator } from "@hono/zod-validator";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain/task-id";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { TaskIdParamSchema } from "../../todo-trash/schema/task-id-param.schema";

/**
 * ゴミ箱タスク個別復元（一般ユーザー用）
 * @route PATCH /api/v1/todo/trash/:id/restore
 */
const restoreTodoTrash = new Hono<AppEnv>().patch(
    API_ENDPOINT.TODO_TRASH_RESTORE,
    authMiddleware,
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const userId = c.get("user")?.userId;
        const taskId = new TaskId(c.req.valid("param").id);

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        await db.run(sql`
            WITH RECURSIVE descendants(id) AS (
                SELECT id FROM task_transaction WHERE id = ${taskId.value}
                UNION ALL
                SELECT t.id FROM task_transaction t
                INNER JOIN descendants d ON t.parent_id = d.id
            )
            UPDATE task_transaction
            SET delete_flg = 0, updated_at = ${new Date().toISOString()}
            WHERE id IN (SELECT id FROM descendants)
            AND delete_flg = 1
            AND user_id = ${userId.value}
        `);

        return c.json({ message: "タスクを復元しました。" }, HTTP_STATUS.OK);
    }
);

export { restoreTodoTrash };
