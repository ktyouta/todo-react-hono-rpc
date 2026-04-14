import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { CategoryType, TaskCategory, TaskContent, TaskId, TaskStatus, TaskTitle } from "../../../domain";
import { TaskDueDate } from "../../../domain/task-due-date";
import { TaskPriority } from "../../../domain/task-priority";
import { taskTransaction } from "../../../infrastructure";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { TaskEntity } from "../../todo/entity/task.entity";
import { TaskIdParamSchema } from "../../todo/schema/task-id-param.schema";
import { GetParentTaskRepository } from "../repository/get-parent-task.repository";
import { CreateSubtaskSchema } from "../schema/create-subtask.schema";
import { GetParentTaskService } from "../service/get-parent-task.service";

/**
 * サブタスク作成
 * @route POST /api/v1/todo/:id/subtasks
 */
const createSubtask = new Hono<AppEnv>().post(
    API_ENDPOINT.TODO_SUBTASK,
    authMiddleware,
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    zValidator("json", CreateSubtaskSchema, (result, c) => {
        if (!result.success) {
            const data = formatZodErrors(result.error);
            const message = data.map((e) => e.message);
            return c.json({ message, data }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const body = c.req.valid("json");
        const db = c.get("db");
        const userId = c.get("user")?.userId;

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        const parentTaskId = new TaskId(c.req.valid("param").id);

        const repository = new GetParentTaskRepository(db);
        const service = new GetParentTaskService(repository);
        const parentTask = await service.find(userId, parentTaskId);

        if (!parentTask) {
            return c.json({ message: "親タスクが存在しません。" }, HTTP_STATUS.NOT_FOUND);
        }

        const taskTitle = new TaskTitle(body.title);
        const taskContent = new TaskContent(body.content);
        const taskCategory = new TaskCategory(body.category);
        const taskStatus = new TaskStatus(body.status);
        const taskPriority = new TaskPriority(body.priority);
        const taskDueDate = new TaskDueDate(body.dueDate);
        const taskEntity = new TaskEntity(taskTitle, taskContent, taskCategory, taskStatus, taskPriority, taskDueDate);
        const isMemo = taskEntity.category === CategoryType.memo;
        const now = new Date().toISOString();

        await db.batch([
            db.insert(taskTransaction).values({
                title: taskEntity.taskTitle,
                content: taskEntity.taskContent,
                categoryId: taskEntity.category,
                statusId: isMemo ? null : taskEntity.status,
                priorityId: isMemo ? null : taskEntity.priority,
                dueDate: isMemo ? null : taskEntity.dueDate,
                userId: userId.value,
                parentId: parentTaskId.value,
                deleteFlg: false,
                createdAt: now,
                updatedAt: now,
            }),
        ]);

        return c.json({ message: "サブタスクを追加しました。" }, HTTP_STATUS.CREATED);
    }
);

export { createSubtask };
