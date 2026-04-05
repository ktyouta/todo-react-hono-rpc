import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { BulkDeleteTodoRepository } from "../repository/bulk-delete-todo.repository";
import { BulkDeleteTodoSchema } from "../schema/bulk-delete-todo.schema";

/**
 * タスク一括削除
 * @route DELETE /api/v1/todo/bulk
 */
const bulkDeleteTodo = new Hono<AppEnv>().delete(
  API_ENDPOINT.TODO_BULK,
  authMiddleware,
  zValidator("json", BulkDeleteTodoSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "バリデーションエラー", data: formatZodErrors(result.error) }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    }
  }),
  async (c) => {
    const db = c.get("db");
    const userId = c.get("user")?.userId;

    if (!userId) {
      return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
    }

    const { ids } = c.req.valid("json");
    const repository = new BulkDeleteTodoRepository(db);
    const now = new Date().toISOString();

    const favoriteIds = await repository.findFavoriteIds(userId, ids);
    // タスクのお気に入りチェック
    if (favoriteIds.length > 0) {
      return c.json(
        { message: "お気に入りのタスクが含まれています。お気に入りを解除してから削除してください。" },
        HTTP_STATUS.UNPROCESSABLE_ENTITY
      );
    }

    // 一括削除
    await repository.bulkDelete(userId, ids, now);

    return c.json({ message: "タスクを一括削除しました。" }, HTTP_STATUS.OK);
  }
);

export { bulkDeleteTodo };
