import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetTodoManagementSubtaskRepository } from "../repository/get-todo-management-subtask.repository";
import { SubtaskIdParamSchema } from "../schema/subtask-id-param.schema";
import { GetTodoManagementSubtaskService } from "../service/get-todo-management-subtask.service";

/**
 * サブタスク詳細取得（管理者用）
 * @route GET /api/v1/todo-management/:id/subtasks/:subId
 */
const getTodoManagementSubtask = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_MANAGEMENT_SUBTASK_ID,
    requirePermission("task_management"),
    zValidator("param", SubtaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const { id, subId } = c.req.valid("param");
        const parentTaskId = new TaskId(id);
        const subtaskId = new TaskId(subId);

        const repository = new GetTodoManagementSubtaskRepository(db);
        const service = new GetTodoManagementSubtaskService(repository);
        const subtask = await service.find(parentTaskId, subtaskId);

        if (!subtask) {
            return c.json({ message: "サブタスクが見つかりません。" }, HTTP_STATUS.NOT_FOUND);
        }

        return c.json({ message: "サブタスクを取得しました。", data: subtask }, HTTP_STATUS.OK);
    }
);

export { getTodoManagementSubtask };
