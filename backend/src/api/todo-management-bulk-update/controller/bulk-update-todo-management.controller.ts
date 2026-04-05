import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray, ne } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { CategoryType } from "../../../domain";
import { taskTransaction } from "../../../infrastructure";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { BulkUpdateTodoManagementSchema } from "../schema/bulk-update-todo-management.schema";

/**
 * タスク一括更新（管理者用）
 * @route PATCH /api/v1/todo-management/bulk
 *
 * カテゴリ変更ルール:
 * - categoryId = メモ → statusId / priorityId を null にクリア
 * - categoryId = タスク等 → リクエストの statusId / priorityId をセット
 * - categoryId 未指定 → WHERE に ne 条件を追加してメモタスクをスキップ
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
    const { ids, categoryId, statusId, priorityId } = c.req.valid("json");
    const now = new Date().toISOString();
    const isMemo = categoryId === CategoryType.memo;

    await db
      .update(taskTransaction)
      .set({
        ...(categoryId !== undefined && { categoryId }),
        ...(isMemo
          ? { statusId: null, priorityId: null }
          : {
              ...(statusId !== undefined && { statusId }),
              ...(priorityId !== undefined && { priorityId }),
            }),
        updatedAt: now,
      })
      .where(
        and(
          eq(taskTransaction.deleteFlg, false),
          inArray(taskTransaction.id, ids),
          // カテゴリ変更なしの場合、メモタスクをスキップ
          ...(categoryId === undefined
            ? [ne(taskTransaction.categoryId, CategoryType.memo)]
            : []),
        )
      );

    return c.json({ message: "タスクを一括更新しました。" }, HTTP_STATUS.OK);
  }
);

export { bulkUpdateTodoManagement };
