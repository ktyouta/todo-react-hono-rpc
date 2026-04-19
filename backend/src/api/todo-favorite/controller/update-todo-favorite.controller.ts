import { zValidator } from "@hono/zod-validator";
import { and, eq, isNull } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain";
import { taskTransaction } from "../../../infrastructure";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { TaskIdParamSchema } from "../../todo/schema/task-id-param.schema";
import { UpdateTodoFavoriteSchema } from "../schema/update-todo-favorite.schema";

/**
 * お気に入りトグル
 * @route PATCH /api/v1/todo/:id/favorite
 */
const updateTodoFavorite = new Hono<AppEnv>().patch(
    API_ENDPOINT.TODO_FAVORITE,
    authMiddleware,
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    zValidator("json", UpdateTodoFavoriteSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "バリデーションエラー", data: formatZodErrors(result.error) }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const userId = c.get("user")?.userId;

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        const taskId = new TaskId(c.req.valid("param").id);
        const { isFavorite } = c.req.valid("json");
        const now = new Date().toISOString();

        const result = await db
            .update(taskTransaction)
            .set({ isFavorite, updatedAt: now })
            .where(
                and(
                    eq(taskTransaction.id, taskId.value),
                    eq(taskTransaction.userId, userId.value),
                    eq(taskTransaction.deleteFlg, false),
                    isNull(taskTransaction.parentId)
                )
            )
            .returning();

        if (result.length === 0) {
            return c.json({ message: "タスクが見つかりません。" }, HTTP_STATUS.NOT_FOUND);
        }

        return c.json({ message: "お気に入りを更新しました。" }, HTTP_STATUS.OK);
    }
);

export { updateTodoFavorite };

