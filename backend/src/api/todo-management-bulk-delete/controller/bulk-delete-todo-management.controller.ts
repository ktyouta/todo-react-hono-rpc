import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray, or } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { taskTransaction } from "../../../infrastructure";
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

    await db
      .update(taskTransaction)
      .set({ deleteFlg: true, updatedAt: now })
      .where(
        and(
          eq(taskTransaction.deleteFlg, false),
          or(
            inArray(taskTransaction.id, ids),
            inArray(taskTransaction.parentId, ids)
          )
        )
      );

    return c.json({ message: "タスクを一括削除しました。" }, HTTP_STATUS.OK);
  }
);

export { bulkDeleteTodoManagement };
