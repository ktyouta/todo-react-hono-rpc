import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetTodoTrashListRepository } from "../repository/get-todo-trash-list.repository";
import { GetTodoTrashListQuerySchema } from "../schema/get-todo-trash-list-query.schema";
import { GetTodoTrashListService } from "../service/get-todo-trash-list.service";

/**
 * ゴミ箱タスク一覧取得（一般ユーザー用）
 * @route GET /api/v1/todo/trash
 */
const getTodoTrashList = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_TRASH,
    authMiddleware,
    zValidator("query", GetTodoTrashListQuerySchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "クエリが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const userId = c.get("user")?.userId;
        const query = c.req.valid("query");

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        const repository = new GetTodoTrashListRepository(db);
        const service = new GetTodoTrashListService(repository);

        const { list, total } = await service.findAll(userId, query);
        const totalPages = Math.ceil(total / GetTodoTrashListRepository.LIMIT);
        return c.json({ message: "ゴミ箱タスク一覧を取得しました。", data: { list, total, totalPages } }, HTTP_STATUS.OK);
    }
);

export { getTodoTrashList };
