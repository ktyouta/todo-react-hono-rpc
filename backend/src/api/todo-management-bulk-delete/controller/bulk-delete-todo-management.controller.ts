import { zValidator } from "@hono/zod-validator";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { BulkDeleteTodoManagementSchema } from "../schema/bulk-delete-todo-management.schema";

/**
 * タスク一括削除（管理者用）
 * @route DELETE /api/v1/todo-management/bulk
 */
const bulkDeleteTodoManagement = new Hono<AppEnv>().delete(
  API_ENDPOINT.TODO_MANAGEMENT_BULK,
  requirePermission("task_management"),
  zValidator("json", BulkDeleteTodoManagementSchema, (result, c) => {
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
      SET delete_flg = 1, updated_at = ${now}
      WHERE id IN (SELECT id FROM descendants)
      AND delete_flg = 0
    `);

    return c.json({ message: "タスクを一括削除しました。" }, HTTP_STATUS.OK);
  }
);

export { bulkDeleteTodoManagement };
