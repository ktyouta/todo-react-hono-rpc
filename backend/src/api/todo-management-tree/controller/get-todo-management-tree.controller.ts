import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain/task-id";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { TaskIdParamSchema } from "../../todo-management/schema/task-id-param.schema";
import { GetTodoManagementTreeRepository } from "../repository/get-todo-management-tree.repository";
import { GetTodoManagementTreeService } from "../service/get-todo-management-tree.service";

/**
 * タスクツリー取得（管理者用）
 * @route GET /api/v1/todo-management/:id/tree
 */
const getTodoManagementTree = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_MANAGEMENT_TREE,
    requirePermission("task_management"),
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const repository = new GetTodoManagementTreeRepository(db);
        const service = new GetTodoManagementTreeService(repository);
        const taskId = new TaskId(c.req.valid("param").id);

        const tree = await service.findTree(taskId);

        if (tree.length === 0) {
            return c.json({ message: "Not Found" }, HTTP_STATUS.NOT_FOUND);
        }

        return c.json({ message: "タスクツリーを取得しました。", data: tree }, HTTP_STATUS.OK);
    }
);

export { getTodoManagementTree };
