import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { TaskContent } from "src/domain/task-content";
import { TaskTitle } from "src/domain/task-title";
import { taskTransaction } from "src/infrastructure";
import { API_ENDPOINT, FLG, HTTP_STATUS } from "../../../constant";
import { authMiddleware, userOperationGuardMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../type";
import { formatZodErrors } from "../../../util";
import { TaskEntity } from "../entity/task-entity";
import { CreateTodoSchema } from "../schema";


/**
 * タスク作成
 * @route POST /api/v1/todo
 */
const createFrontUser = new Hono<AppEnv>().post(
    API_ENDPOINT.TODO,
    userOperationGuardMiddleware,
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
        const taskEntity = new TaskEntity(taskTitle, taskContent);
        const userId = c.get("user")?.info.id;
        const now = new Date().toISOString();

        await db.batch([
            db.insert(taskTransaction).values({
                title: taskEntity.taskTitle,
                content: taskEntity.taskContent,
                userId: userId,
                deleteFlg: FLG.OFF,
                createdAt: now,
                updatedAt: now,
            }),
        ]);

        return c.json({ message: "タスクを追加しました。" }, HTTP_STATUS.CREATED);
    }
);

export { createFrontUser };

