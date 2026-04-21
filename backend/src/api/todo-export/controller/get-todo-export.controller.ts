import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetTodoExportRepository } from "../repository/get-todo-export.repository";
import { GetTodoExportQuerySchema } from "../schema/get-todo-export-query.schema";
import { GetTodoExportService } from "../service/get-todo-export.service";

/**
 * タスクCSVエクスポート
 * @route GET /api/v1/todo-export
 */
const getTodoExport = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_EXPORT,
    authMiddleware,
    zValidator("query", GetTodoExportQuerySchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "クエリが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get('db');
        const repository = new GetTodoExportRepository(db);
        const service = new GetTodoExportService(repository);
        const userId = c.get("user")?.userId;
        const query = c.req.valid("query");

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        const items = await service.fetchData(userId, query);
        const csv = service.convertToCsv(items);

        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

        return c.text(csv, HTTP_STATUS.OK, {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="tasks_${date}.csv"`,
        });
    }
);

export { getTodoExport };
