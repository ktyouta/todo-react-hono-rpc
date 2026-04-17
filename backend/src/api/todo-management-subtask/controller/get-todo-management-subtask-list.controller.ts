import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { TaskIdParamSchema } from "../../todo-management/schema/task-id-param.schema";
import { GetTodoManagementSubtaskListRepository } from "../repository/get-todo-management-subtask-list.repository";
import { GetTodoManagementSubtaskListService } from "../service/get-todo-management-subtask-list.service";

/**
 * サブタスク一覧取得（管理者用）
 * @route GET /api/v1/todo-management/:id/subtasks
 */
const getTodoManagementSubtaskList = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_MANAGEMENT_SUBTASK,
    requirePermission("task_management"),
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const parentTaskId = new TaskId(c.req.valid("param").id);
        const repository = new GetTodoManagementSubtaskListRepository(db);
        const service = new GetTodoManagementSubtaskListService(repository);
        const list = await service.findAll(parentTaskId);

        return c.json({ message: "サブタスク一覧を取得しました。", data: list }, HTTP_STATUS.OK);
    }
);

export { getTodoManagementSubtaskList };
