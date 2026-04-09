import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain/task-id";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetTodoTrashRepository } from "../repository/get-todo-trash.repository";
import { TaskIdParamSchema } from "../schema/task-id-param.schema";
import { GetTodoTrashService } from "../service/get-todo-trash.service";

/**
 * ゴミ箱タスク詳細取得（一般ユーザー用）
 * @route GET /api/v1/todo/trash/:id
 */
const getTodoTrash = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_TRASH_ID,
    authMiddleware,
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const userId = c.get("user")?.userId;
        const taskId = new TaskId(c.req.valid("param").id);

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        const repository = new GetTodoTrashRepository(db);
        const service = new GetTodoTrashService(repository);

        const task = await service.find(taskId, userId);

        if (!task) {
            return c.json({ message: "Not Found", data: task }, HTTP_STATUS.NOT_FOUND);
        }

        return c.json({ message: "ゴミ箱タスクを取得しました。", data: task }, HTTP_STATUS.OK);
    }
);

export { getTodoTrash };
