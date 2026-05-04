import { zValidator } from "@hono/zod-validator";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { BulkRestoreTodoTrashSchema } from "../schema/bulk-restore-todo-trash.schema";

/**
 * ゴミ箱タスク一括復元（一般ユーザー用）
 * @route PATCH /api/v1/todo/trash/bulk/restore
 */
const restoreTodoTrashBulk = new Hono<AppEnv>().patch(
    API_ENDPOINT.TODO_TRASH_BULK_RESTORE,
    authMiddleware,
    zValidator("json", BulkRestoreTodoTrashSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "バリデーションエラー", data: formatZodErrors(result.error) }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const userId = c.get("user")?.userId;
        const { ids } = c.req.valid("json");

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

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
            SET delete_flg = 0, updated_at = ${new Date().toISOString()}
            WHERE id IN (SELECT id FROM descendants)
            AND delete_flg = 1
            AND user_id = ${userId.value}
        `);

        return c.json({ message: "タスクを復元しました。" }, HTTP_STATUS.OK);
    }
);

export { restoreTodoTrashBulk };
