import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { ImportTodoRepository } from "../repository/import-todo.repository";
import { ImportTodoFormSchema } from "../schema/import-todo.schema";
import { ImportTodoService } from "../service/import-todo.service";

/**
 * タスクCSVインポート
 * @route POST /api/v1/todo-import
 */
const importTodo = new Hono<AppEnv>().post(
  API_ENDPOINT.TODO_IMPORT,
  authMiddleware,
  zValidator("form", ImportTodoFormSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "バリデーションエラー", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
    }
  }),
  async (c) => {
    const userId = c.get("user")?.userId;

    if (!userId) {
      return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
    }

    const { file } = c.req.valid("form");
    const csvText = await file.text();
    const service = new ImportTodoService();
    const db = c.get("db");
    const repository = new ImportTodoRepository(db);

    // CSV行に変換
    const csvRows = service.toCsvRows(csvText);

    // 200行超過はファイル全体のエラー
    if (service.isOverMaxRows(csvRows)) {
      return c.json({ message: "一度にインポートできる最大行数は200行です" }, HTTP_STATUS.BAD_REQUEST);
    }

    // 重複ID・フィールド不正チェック
    const parseResult = service.parse(csvRows);

    const { errors } = parseResult;
    let { validRows } = parseResult;

    if (validRows.length > 0) {
      const validIds = validRows.map((r) => r.id);
      const invalidIds = await repository.findInvalidIds(userId, validIds);

      if (invalidIds.length > 0) {
        const invalidIdSet = new Set(invalidIds);
        validRows = validRows.filter((row) => {
          if (invalidIdSet.has(row.id)) {
            errors.push({ row: row.rowNumber, id: row.id, message: "該当するタスクが見つかりません" });
            return false;
          }
          return true;
        });
      }
    }

    if (validRows.length > 0) {
      const now = new Date().toISOString();
      await repository.bulkUpdate(userId, validRows, now);
    }

    return c.json(
      {
        message: errors.length === 0 ? "タスクを更新しました" : "一部のタスクの更新に失敗しました",
        successCount: validRows.length,
        errors,
      },
      HTTP_STATUS.OK
    );
  }
);

export { importTodo };
