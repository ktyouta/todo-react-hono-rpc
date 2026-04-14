import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
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
import { SubtaskIdParamSchema } from "../schema/subtask-id-param.schema";
import { UpdateSubtaskSchema } from "../schema/update-subtask.schema";

/**
 * サブタスク更新
 * @route PATCH /api/v1/todo/:id/subtasks/:subId
 */
const updateSubtask = new Hono<AppEnv>().patch(
    API_ENDPOINT.TODO_SUBTASK_ID,
    authMiddleware,
    zValidator("param", SubtaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    zValidator("json", UpdateSubtaskSchema, (result, c) => {
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

        const { id, subId } = c.req.valid("param");
        const parentTaskId = new TaskId(id);
        const subtaskId = new TaskId(subId);

        const taskTitle = new TaskTitle(body.title);
        const taskContent = new TaskContent(body.content);
        const taskCategory = new TaskCategory(body.category);
        const taskStatus = new TaskStatus(body.status);
        const taskPriority = new TaskPriority(body.priority);
        const taskDueDate = new TaskDueDate(body.dueDate);
        const taskEntity = new TaskEntity(taskTitle, taskContent, taskCategory, taskStatus, taskPriority, taskDueDate);
        const isMemo = taskEntity.category === CategoryType.memo;
        const now = new Date().toISOString();

        const result = await db
            .update(taskTransaction)
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
                    eq(taskTransaction.id, subtaskId.value),
                    eq(taskTransaction.parentId, parentTaskId.value),
                    eq(taskTransaction.userId, userId.value),
                    eq(taskTransaction.deleteFlg, false),
                )
            )
            .returning();

        if (result.length === 0) {
            return c.json({ message: "サブタスクが見つかりません。" }, HTTP_STATUS.NOT_FOUND);
        }

        return c.json({ message: "サブタスクを更新しました。", data: result }, HTTP_STATUS.OK);
    }
);

export { updateSubtask };
