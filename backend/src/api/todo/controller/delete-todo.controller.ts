import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain";
import { taskTransaction } from "../../../infrastructure";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../type";
import { formatZodErrors } from "../../../util";
import { TaskIdParamSchema } from "../schema/task-id-param.schema";


/**
 * タスク削除
 * @route PATCH /api/v1/todo
 */
const deleteTodo = new Hono<AppEnv>().delete(
    API_ENDPOINT.TODO_ID,
    authMiddleware,
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get('db');

        const taskId = new TaskId(c.req.valid("param").id);
        const userId = c.get("user")?.userId;
        const now = new Date().toISOString();

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        await db.batch([
            db.update(taskTransaction)
                .set({
                    updatedAt: now,
                    deleteFlg: true
                })
                .where(
                    and(
                        eq(taskTransaction.id, taskId.value),
                        eq(taskTransaction.userId, userId.value),
                        eq(taskTransaction.deleteFlg, false)
                    )
                ),
        ]);

        return c.json({ message: "タスクを削除しました。" }, HTTP_STATUS.OK);
    }
);

export { deleteTodo };

