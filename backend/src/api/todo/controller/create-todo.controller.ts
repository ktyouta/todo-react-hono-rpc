import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskCategory, TaskContent, TaskStatus, TaskTitle } from "../../../domain";
import { TaskDueDate } from "../../../domain/task-due-date";
import { TaskPriority } from "../../../domain/task-priority";
import { taskTransaction } from "../../../infrastructure";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../type";
import { formatZodErrors } from "../../../util";
import { CreateTodoResponseDto } from "../dto";
import { TaskEntity } from "../entity/task.entity";
import { CreateTodoSchema } from "../schema";


/**
 * タスク作成
 * @route POST /api/v1/todo
 */
const createTodo = new Hono<AppEnv>().post(
    API_ENDPOINT.TODO,
    authMiddleware,
    zValidator("json", CreateTodoSchema, (result, c) => {
        if (!result.success) {
            const data = formatZodErrors(result.error);
            const message = data.map((e) => e.message);
            return c.json({ message, data }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const body = c.req.valid("json");
        const db = c.get('db');

        const taskTitle = new TaskTitle(body.title);
        const taskContent = new TaskContent(body.content);
        const taskCategory = new TaskCategory(body.category);
        const taskStatus = new TaskStatus(body.status);
        const taskPriority = new TaskPriority(body.priority);
        const taskDueDate = new TaskDueDate(body.dueDate);
        const taskEntity = new TaskEntity(taskTitle, taskContent, taskCategory, taskStatus, taskPriority, taskDueDate);
        const userId = c.get("user")?.info.id;
        const now = new Date().toISOString();

        await db.batch([
            db.insert(taskTransaction).values({
                title: taskEntity.taskTitle,
                content: taskEntity.taskContent,
                categoryId: taskEntity.category,
                statusId: taskEntity.status,
                priorityId: taskEntity.priority,
                dueDate: taskEntity.dueDate,
                userId: userId,
                deleteFlg: false,
                createdAt: now,
                updatedAt: now,
            }),
        ]);

        const response = new CreateTodoResponseDto(taskEntity);
        return c.json({ message: "タスクを追加しました。", data: response.value }, HTTP_STATUS.CREATED);
    }
);

export { createTodo };

