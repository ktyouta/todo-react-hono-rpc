import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain/task-id";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetTodoRepository } from "../repository/get-todo.repository";
import { TaskIdParamSchema } from "../schema/task-id-param.schema";
import { GetTodoService } from "../service/get-todo.service";

/**
 * タスク取得
 * @route GET /api/v1/todo/:id
 */
const getTodo = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_ID,
    authMiddleware,
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get('db');
        const repository = new GetTodoRepository(db);
        const service = new GetTodoService(repository);
        const userId = c.get("user")?.userId;
        const taskId = new TaskId(c.req.valid("param").id);

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        const task = await service.find(userId, taskId);

        if (!task) {
            return c.json({ message: "Not Found", data: task }, HTTP_STATUS.NOT_FOUND);
        }

        return c.json({ message: "タスクを取得しました。", data: task }, HTTP_STATUS.OK);
    });

export { getTodo };

