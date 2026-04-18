import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { TaskIdParamSchema } from "../../todo-deleted/schema/task-id-param.schema";
import { GetTodoDeletedSubtaskListRepository } from "../repository/get-todo-deleted-subtask-list.repository";
import { GetTodoDeletedSubtaskListQuerySchema } from "../schema/get-todo-deleted-subtask-list-query.schema";
import { GetTodoDeletedSubtaskListService } from "../service/get-todo-deleted-subtask-list.service";

/**
 * 削除タスク管理サブタスク一覧取得（管理者用）
 * @route GET /api/v1/todo-deleted/:id/subtasks
 */
const getTodoDeletedSubtaskList = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_DELETED_SUBTASK,
    requirePermission("deleted_task_management"),
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    zValidator("query", GetTodoDeletedSubtaskListQuerySchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "クエリが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const query = c.req.valid("query");
        const parentTaskId = new TaskId(c.req.valid("param").id);
        const repository = new GetTodoDeletedSubtaskListRepository(db);
        const service = new GetTodoDeletedSubtaskListService(repository);
        const { list, total } = await service.findAll(parentTaskId, query);
        const totalPages = Math.ceil(total / GetTodoDeletedSubtaskListRepository.LIMIT);

        return c.json({ message: "削除タスク管理サブタスク一覧を取得しました。", data: { list, total, totalPages } }, HTTP_STATUS.OK);
    }
);

export { getTodoDeletedSubtaskList };
