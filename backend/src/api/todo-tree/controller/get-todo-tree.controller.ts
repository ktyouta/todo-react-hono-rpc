import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain/task-id";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetTodoTreeRepository } from "../repository/get-todo-tree.repository";
import { TaskIdParamSchema } from "../../todo/schema/task-id-param.schema";
import { GetTodoTreeService } from "../service/get-todo-tree.service";

/**
 * タスクツリー取得
 * @route GET /api/v1/todo/:id/tree
 */
const getTodoTree = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_TREE,
    authMiddleware,
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get('db');
        const repository = new GetTodoTreeRepository(db);
        const service = new GetTodoTreeService(repository);
        const userId = c.get("user")?.userId;
        const taskId = new TaskId(c.req.valid("param").id);

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        const tree = await service.findTree(userId, taskId);

        if (tree.length === 0) {
            return c.json({ message: "Not Found" }, HTTP_STATUS.NOT_FOUND);
        }

        return c.json({ message: "タスクツリーを取得しました。", data: tree }, HTTP_STATUS.OK);
    });

export { getTodoTree };
