import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../type";
import { GetTodoListRepository } from "../repository/get-todo-list.repository";
import { GetTodoListService } from "../service/get-todo-list.service";

/**
 * タスク一覧取得
 * @route GET /api/v1/todo
 */
const getTodoList = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO,
    authMiddleware,
    async (c) => {
        const db = c.get('db');
        const repository = new GetTodoListRepository(db);
        const service = new GetTodoListService(repository);
        const userId = c.get("user")?.userId;

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        const taskList = await service.findAll(userId);
        return c.json({ message: "タスク一覧を取得しました。", data: taskList }, HTTP_STATUS.OK);
    });

export { getTodoList };

