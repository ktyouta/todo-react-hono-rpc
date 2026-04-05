import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { BulkUpdateTodoRepository } from "../repository/bulk-update-todo.repository";
import { BulkUpdateTodoSchema } from "../schema/bulk-update-todo.schema";

/**
 * タスク一括更新
 * @route PATCH /api/v1/todo/bulk
 */
const bulkUpdateTodo = new Hono<AppEnv>().patch(
  API_ENDPOINT.TODO_BULK,
  authMiddleware,
  zValidator("json", BulkUpdateTodoSchema, (result, c) => {
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

    const query = c.req.valid("json");
    const repository = new BulkUpdateTodoRepository(db);
    const now = new Date().toISOString();

    await repository.bulkUpdate(userId, query, now);

    return c.json({ message: "タスクを一括更新しました。" }, HTTP_STATUS.OK);
  }
);

export { bulkUpdateTodo };
