import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain/task-id";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetTodoManagementRepository } from "../repository/get-todo-management.repository";
import { TaskIdParamSchema } from "../schema/task-id-param.schema";
import { GetTodoManagementService } from "../service/get-todo-management.service";

/**
 * タスク取得（管理者用）
 * @route GET /api/v1/todo-management/:id
 */
const getTodoManagement = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_MANAGEMENT_ID,
    requirePermission("task_management"),
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const repository = new GetTodoManagementRepository(db);
        const service = new GetTodoManagementService(repository);
        const taskId = new TaskId(c.req.valid("param").id);

        const task = await service.find(taskId);

        if (!task) {
            return c.json({ message: "Not Found", data: task }, HTTP_STATUS.NOT_FOUND);
        }

        return c.json({ message: "タスクを取得しました。", data: task }, HTTP_STATUS.OK);
    }
);

export { getTodoManagement };

