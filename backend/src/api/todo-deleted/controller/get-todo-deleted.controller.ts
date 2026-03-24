import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain/task-id";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetTodoDeletedRepository } from "../repository/get-todo-deleted.repository";
import { TaskIdParamSchema } from "../schema/task-id-param.schema";
import { GetTodoDeletedService } from "../service/get-todo-deleted.service";

/**
 * 削除済みタスク取得（管理者用）
 * @route GET /api/v1/todo-deleted/:id
 */
const getTodoDeleted = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_DELETED_ID,
    requirePermission("deleted_task_management"),
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const repository = new GetTodoDeletedRepository(db);
        const service = new GetTodoDeletedService(repository);
        const taskId = new TaskId(c.req.valid("param").id);

        const task = await service.find(taskId);

        if (!task) {
            return c.json({ message: "Not Found", data: task }, HTTP_STATUS.NOT_FOUND);
        }

        return c.json({ message: "削除済みタスクを取得しました。", data: task }, HTTP_STATUS.OK);
    }
);

export { getTodoDeleted };
