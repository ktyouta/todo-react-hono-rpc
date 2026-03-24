import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetTodoDeletedListRepository } from "../repository/get-todo-deleted-list.repository";
import { GetTodoDeletedListQuerySchema } from "../schema/get-todo-deleted-list-query.schema";
import { GetTodoDeletedListService } from "../service/get-todo-deleted-list.service";

/**
 * 削除済みタスク一覧取得（管理者用）
 * @route GET /api/v1/todo-deleted
 */
const getTodoDeletedList = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_DELETED,
    requirePermission("deleted_task_management"),
    zValidator("query", GetTodoDeletedListQuerySchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "クエリが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const repository = new GetTodoDeletedListRepository(db);
        const service = new GetTodoDeletedListService(repository);
        const query = c.req.valid("query");

        const { list, total } = await service.findAll(query);
        const totalPages = Math.ceil(total / GetTodoDeletedListRepository.LIMIT);
        return c.json({ message: "削除済みタスク一覧を取得しました。", data: { list, total, totalPages } }, HTTP_STATUS.OK);
    }
);

export { getTodoDeletedList };
