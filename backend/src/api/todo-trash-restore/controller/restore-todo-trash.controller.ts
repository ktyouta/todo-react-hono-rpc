import { zValidator } from "@hono/zod-validator";
import { and, eq, or } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain/task-id";
import { taskTransaction } from "../../../infrastructure";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { TaskIdParamSchema } from "../../todo-trash/schema/task-id-param.schema";

/**
 * ゴミ箱タスク個別復元（一般ユーザー用）
 * @route PATCH /api/v1/todo/trash/:id/restore
 */
const restoreTodoTrash = new Hono<AppEnv>().patch(
    API_ENDPOINT.TODO_TRASH_RESTORE,
    authMiddleware,
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const userId = c.get("user")?.userId;
        const taskId = new TaskId(c.req.valid("param").id);

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        await db.batch([
            db.update(taskTransaction)
                .set({
                    updatedAt: new Date().toISOString(),
                    deleteFlg: false,
                })
                .where(
                    and(
                        or(
                            eq(taskTransaction.id, taskId.value),
                            eq(taskTransaction.parentId, taskId.value),
                        ),
                        eq(taskTransaction.deleteFlg, true),
                        eq(taskTransaction.userId, userId.value),
                    )
                ),
        ]);

        return c.json({ message: "タスクを復元しました。" }, HTTP_STATUS.OK);
    }
);

export { restoreTodoTrash };
