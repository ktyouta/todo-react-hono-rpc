import { zValidator } from "@hono/zod-validator";
import { and, eq, or } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain/task-id";
import { taskTransaction } from "../../../infrastructure";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { TaskIdParamSchema } from "../schema/task-id-param.schema";

/**
 * ゴミ箱タスク完全削除（一般ユーザー用）
 * @route DELETE /api/v1/todo/trash/:id
 */
const deleteTodoTrash = new Hono<AppEnv>().delete(
    API_ENDPOINT.TODO_TRASH_ID,
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
            db.delete(taskTransaction)
                .where(
                    and(
                        or(
                            eq(taskTransaction.id, taskId.value),
                            eq(taskTransaction.parentId, taskId.value)
                        ),
                        eq(taskTransaction.deleteFlg, true),
                        eq(taskTransaction.userId, userId.value),
                    )
                ),
        ]);

        return c.json({ message: "タスクを完全に削除しました。" }, HTTP_STATUS.OK);
    }
);

export { deleteTodoTrash };
