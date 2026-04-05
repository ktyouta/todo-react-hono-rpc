import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { CategoryType, TaskCategory, TaskContent, TaskStatus, TaskTitle } from "../../../domain";
import { TaskDueDate } from "../../../domain/task-due-date";
import { TaskId } from "../../../domain/task-id";
import { TaskPriority } from "../../../domain/task-priority";
import { taskTransaction } from "../../../infrastructure";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { UpdateTodoManagementResponseDto } from "../dto/update-todo-management-response.dto";
import { TaskEntity } from "../entity/task.entity";
import { TaskIdParamSchema } from "../schema/task-id-param.schema";
import { UpdateTodoManagementSchema } from "../schema/update-todo-management.schema";

/**
 * タスク更新（管理者用）
 * @route PATCH /api/v1/todo-management/:id
 */
const updateTodoManagement = new Hono<AppEnv>().patch(
    API_ENDPOINT.TODO_MANAGEMENT_ID,
    requirePermission("task_management"),
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    zValidator("json", UpdateTodoManagementSchema, (result, c) => {
        if (!result.success) {
            const data = formatZodErrors(result.error);
            const message = data.map((e) => e.message);
            return c.json({ message, data }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const body = c.req.valid("json");
        const db = c.get("db");
        const taskId = new TaskId(c.req.valid("param").id);
        const taskTitle = new TaskTitle(body.title);
        const taskContent = new TaskContent(body.content);
        const taskCategory = new TaskCategory(body.category);
        const taskStatus = new TaskStatus(body.status);
        const taskPriority = new TaskPriority(body.priority);
        const taskDueDate = new TaskDueDate(body.dueDate);
        const taskEntity = new TaskEntity(taskTitle, taskContent, taskCategory, taskStatus, taskPriority, taskDueDate);
        const now = new Date().toISOString();
        const isMemo = taskEntity.category === CategoryType.memo;

        await db.batch([
            db.update(taskTransaction)
                .set({
                    title: taskEntity.taskTitle,
                    content: taskEntity.taskContent,
                    categoryId: taskEntity.category,
                    statusId: isMemo ? null : taskEntity.status,
                    priorityId: isMemo ? null : taskEntity.priority,
                    dueDate: isMemo ? null : taskEntity.dueDate,
                    updatedAt: now,
                })
                .where(
                    and(
                        eq(taskTransaction.id, taskId.value),
                        eq(taskTransaction.deleteFlg, false)
                    )
                ),
        ]);

        const response = new UpdateTodoManagementResponseDto(taskEntity);
        return c.json({ message: "タスクを更新しました。", data: response.value }, HTTP_STATUS.CREATED);
    }
);

export { updateTodoManagement };

