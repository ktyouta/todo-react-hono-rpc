import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../type";
import { formatZodErrors } from "../../../util";
import { GetTodoListRepository } from "../repository/get-todo-list.repository";
import { GetTodoListQuerySchema } from "../schema/get-todo-list-query.schema";
import { GetTodoListService } from "../service/get-todo-list.service";

/**
 * タスク一覧取得
 * @route GET /api/v1/todo
 */
const getTodoList = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO,
    authMiddleware,
    zValidator("query", GetTodoListQuerySchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "クエリが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get('db');
        const repository = new GetTodoListRepository(db);
        const service = new GetTodoListService(repository);
        const userId = c.get("user")?.userId;
        const query = c.req.valid("query");

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        const taskList = await service.findAll(userId, query);
        return c.json({ message: "タスク一覧を取得しました。", data: taskList }, HTTP_STATUS.OK);
    });

export { getTodoList };

