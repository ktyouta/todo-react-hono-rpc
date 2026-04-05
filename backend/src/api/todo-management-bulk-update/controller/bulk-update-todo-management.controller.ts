import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { taskTransaction } from "../../../infrastructure";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { BulkUpdateTodoManagementSchema } from "../schema/bulk-update-todo-management.schema";

/**
 * タスク一括更新（管理者用）
 * @route PATCH /api/v1/todo-management/bulk
 */
const bulkUpdateTodoManagement = new Hono<AppEnv>().patch(
  API_ENDPOINT.TODO_MANAGEMENT_BULK,
  requirePermission("task_management"),
  zValidator("json", BulkUpdateTodoManagementSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "バリデーションエラー", data: formatZodErrors(result.error) }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    }
  }),
  async (c) => {
    const db = c.get("db");
    const { ids, statusId, categoryId, priorityId } = c.req.valid("json");
    const now = new Date().toISOString();

    await db
      .update(taskTransaction)
      .set({
        ...(statusId !== undefined && { statusId }),
        ...(categoryId !== undefined && { categoryId }),
        ...(priorityId !== undefined && { priorityId }),
        updatedAt: now,
      })
      .where(
        and(
          eq(taskTransaction.deleteFlg, false),
          inArray(taskTransaction.id, ids)
        )
      );

    return c.json({ message: "タスクを一括更新しました。" }, HTTP_STATUS.OK);
  }
);

export { bulkUpdateTodoManagement };
