import { zValidator } from "@hono/zod-validator";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain/task-id";
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

        await db.run(sql`
            WITH RECURSIVE descendants(id) AS (
                SELECT id FROM task_transaction WHERE id = ${taskId.value}
                UNION ALL
                SELECT t.id FROM task_transaction t
                INNER JOIN descendants d ON t.parent_id = d.id
            )
            UPDATE task_transaction
            SET delete_flg = 0, updated_at = ${now}
            WHERE id IN (SELECT id FROM descendants)
            AND delete_flg = 1
        `);

        return c.json({ message: "タスクを復元しました。" }, HTTP_STATUS.OK);
    }
);

export { restoreTodoDeleted };
