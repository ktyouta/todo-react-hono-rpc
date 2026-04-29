import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetTodoManagementExportRepository } from "../repository/get-todo-management-export.repository";
import { GetTodoManagementExportQuerySchema } from "../schema/get-todo-management-export-query.schema";
import { GetTodoManagementExportService } from "../service/get-todo-management-export.service";

/**
 * タスク管理CSVエクスポート（管理者用）
 * @route GET /api/v1/todo-management-export
 */
const getTodoManagementExport = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_MANAGEMENT_EXPORT,
    requirePermission("task_management"),
    zValidator("query", GetTodoManagementExportQuerySchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "クエリが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const repository = new GetTodoManagementExportRepository(db);
        const service = new GetTodoManagementExportService(repository);
        const query = c.req.valid("query");

        // タスク一覧取得
        const items = await service.fetchData(query);
        // CSVに変換
        const csv = service.convertToCsv(items);
        const date = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');

        return c.text(csv, HTTP_STATUS.OK, {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="tasks_management_${date}.csv"`,
        });
    }
);

export { getTodoManagementExport };
