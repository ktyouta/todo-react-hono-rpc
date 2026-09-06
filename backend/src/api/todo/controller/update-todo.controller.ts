import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { CategoryType, TaskCategory, TaskContent, TaskId, TaskStatus, TaskTitle } from "../../../domain";
import { TaskDueDate } from "../../../domain/task-due-date";
import { TaskPriority } from "../../../domain/task-priority";
import { taskTransaction } from "../../../infrastructure";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { UpdateTodoResponseDto } from "../dto/update-todo-response.dto";
import { TaskEntity } from "../entity/task.entity";
import { UpdateTodoRepository } from "../repository/update-todo.repository";
import { TaskIdParamSchema } from "../schema/task-id-param.schema";
import { UpdateTodoSchema } from "../schema/update-todo.schema";
import { UpdateTodoService } from "../service/update-todo.service";


/**
 * タスク更新
 * @route PATCH /api/v1/todo
 */
const updateTodo = new Hono<AppEnv>().patch(
    API_ENDPOINT.TODO_ID,
    authMiddleware,
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    zValidator("json", UpdateTodoSchema, (result, c) => {
        if (!result.success) {
            const data = formatZodErrors(result.error);
            const message = data.map((e) => e.message);
            return c.json({ message, data }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const body = c.req.valid("json");
        const db = c.get('db');

        const taskId = new TaskId(c.req.valid("param").id);
        const taskTitle = new TaskTitle(body.title);
        const taskContent = new TaskContent(body.content);
        const taskCategory = new TaskCategory(body.category);
        const taskStatus = new TaskStatus(body.status);
        const taskPriority = new TaskPriority(body.priority);
        const taskDueDate = new TaskDueDate(body.dueDate);
        const taskEntity = new TaskEntity(taskTitle, taskContent, taskCategory, taskStatus, taskPriority, taskDueDate);
        const userId = c.get("user")?.userId;
        const now = new Date().toISOString();
        const isMemo = taskEntity.category === CategoryType.memo;

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        // 祖先タスクID一覧を取得
        const repository = new UpdateTodoRepository(db);
        const service = new UpdateTodoService(repository);
        const ancestorIds = await service.findAncestorIds(userId, taskId);

        const statements = [
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
                        eq(taskTransaction.userId, userId.value),
                        eq(taskTransaction.deleteFlg, false)
                    )
                ),
            // 祖先タスクの更新日時を追従
            ...(ancestorIds.length > 0
                ? [
                    db.update(taskTransaction)
                        .set({ updatedAt: now })
                        .where(
                            and(
                                inArray(taskTransaction.id, ancestorIds),
                                eq(taskTransaction.deleteFlg, false),
                            )
                        ),
                ]
                : []),
        ];

        await db.batch(statements as [typeof statements[0], ...typeof statements[0][]]);

        const response = new UpdateTodoResponseDto(taskEntity);
        return c.json({ message: "タスクを更新しました。", data: response.value }, HTTP_STATUS.CREATED);
    }
);

export { updateTodo };

