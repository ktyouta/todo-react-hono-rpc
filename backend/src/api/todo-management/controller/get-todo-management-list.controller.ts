import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetTodoManagementListRepository } from "../repository/get-todo-management-list.repository";
import { GetTodoManagementListQuerySchema } from "../schema/get-todo-management-list-query.schema";
import { GetTodoManagementListService } from "../service/get-todo-management-list.service";

/**
 * タスク一覧取得（管理者用）
 * @route GET /api/v1/todo-management
 */
const getTodoManagementList = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_MANAGEMENT,
    requirePermission("task_management"),
    zValidator("query", GetTodoManagementListQuerySchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "クエリが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const repository = new GetTodoManagementListRepository(db);
        const service = new GetTodoManagementListService(repository);
        const query = c.req.valid("query");

        const { list, total } = await service.findAll(query);
        const totalPages = Math.ceil(total / GetTodoManagementListRepository.LIMIT);
        return c.json({ message: "タスク一覧を取得しました。", data: { list, total, totalPages } }, HTTP_STATUS.OK);
    }
);

export { getTodoManagementList };

