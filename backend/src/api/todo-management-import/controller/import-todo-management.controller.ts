import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { ImportTodoManagementRepository } from "../repository/import-todo-management.repository";
import { ImportTodoManagementFormSchema } from "../schema/import-todo-management.schema";
import { ImportTodoManagementService } from "../service/import-todo-management.service";

/**
 * タスク管理CSVインポート（管理者用）
 * @route POST /api/v1/todo-management-import
 */
const importTodoManagement = new Hono<AppEnv>().post(
  API_ENDPOINT.TODO_MANAGEMENT_IMPORT,
  requirePermission("task_management"),
  zValidator("form", ImportTodoManagementFormSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "バリデーションエラー", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
    }
  }),
  async (c) => {
    const { file } = c.req.valid("form");
    const csvText = await file.text();
    const db = c.get("db");
    const repository = new ImportTodoManagementRepository(db);
    const service = new ImportTodoManagementService(repository);

    // CSV行に変換
    const csvRows = service.toCsvRows(csvText);

    // 行数不足エラー
    if (service.isShortageRows(csvRows)) {
      return c.json({ message: "インポートするデータが存在しません" }, HTTP_STATUS.BAD_REQUEST);
    }

    // 200行超過はファイル全体のエラー
    if (service.isOverMaxRows(csvRows)) {
      return c.json({ message: "一度にインポートできる最大行数は200行です" }, HTTP_STATUS.BAD_REQUEST);
    }

    // バリデーションチェック
    const validateResult = service.getValidateResult(csvRows);

    if (validateResult.validRows.length === 0) {
      return c.json(
        {
          message: "タスクの更新に失敗しました",
          successCount: 0,
          errors: validateResult.errors,
        },
        HTTP_STATUS.OK
      );
    }

    // タスク一覧取得
    const tasks = await service.findTasks(validateResult.validRows);

    // 更新エラー対象を取得
    const result = service.getTargetRows(validateResult, tasks);
    const { validRows, errors } = result;

    // 更新対象が存在
    if (validRows.length > 0) {
      await service.bulkUpdateTask(validRows);
    }
    else {
      return c.json(
        {
          message: "タスクの更新に失敗しました",
          successCount: validRows.length,
          errors,
        },
        HTTP_STATUS.OK
      );
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

export { importTodoManagement };
