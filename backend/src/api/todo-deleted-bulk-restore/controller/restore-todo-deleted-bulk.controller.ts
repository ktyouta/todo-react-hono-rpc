import { zValidator } from "@hono/zod-validator";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
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

        const valuesSql = sql.join(ids.map(id => sql`(${id})`), sql`, `);
        await db.run(sql`
            WITH RECURSIVE
            base_ids(id) AS (VALUES ${valuesSql}),
            descendants(id) AS (
                SELECT id FROM task_transaction WHERE id IN (SELECT id FROM base_ids)
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

export { restoreTodoDeletedBulk };
