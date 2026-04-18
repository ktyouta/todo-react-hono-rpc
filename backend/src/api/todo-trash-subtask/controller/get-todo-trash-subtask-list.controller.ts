import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { TaskIdParamSchema } from "../../todo-trash/schema/task-id-param.schema";
import { GetTodoTrashSubtaskListRepository } from "../repository/get-todo-trash-subtask-list.repository";
import { GetTodoTrashSubtaskListQuerySchema } from "../schema/get-todo-trash-subtask-list-query.schema";
import { GetTodoTrashSubtaskListService } from "../service/get-todo-trash-subtask-list.service";

/**
 * ゴミ箱サブタスク一覧取得（一般ユーザー用）
 * @route GET /api/v1/todo/trash/:id/subtasks
 */
const getTodoTrashSubtaskList = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_TRASH_SUBTASK,
    authMiddleware,
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    zValidator("query", GetTodoTrashSubtaskListQuerySchema, (result, c) => {
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

        const parentTaskId = new TaskId(c.req.valid("param").id);
        const repository = new GetTodoTrashSubtaskListRepository(db);
        const service = new GetTodoTrashSubtaskListService(repository);
        const { list, total } = await service.findAll(userId, parentTaskId, query);
        const totalPages = Math.ceil(total / GetTodoTrashSubtaskListRepository.LIMIT);

        return c.json({ message: "ゴミ箱サブタスク一覧を取得しました。", data: { list, total, totalPages } }, HTTP_STATUS.OK);
    }
);

export { getTodoTrashSubtaskList };
