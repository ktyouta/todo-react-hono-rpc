import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetSubtaskRepository } from "../repository/get-subtask.repository";
import { SubtaskIdParamSchema } from "../schema/subtask-id-param.schema";
import { GetSubtaskService } from "../service/get-subtask.service";

/**
 * サブタスク詳細取得
 * @route GET /api/v1/todo/:id/subtasks/:subId
 */
const getSubtask = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_SUBTASK_ID,
    authMiddleware,
    zValidator("param", SubtaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const userId = c.get("user")?.userId;

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        const { id, subId } = c.req.valid("param");
        const parentTaskId = new TaskId(id);
        const subtaskId = new TaskId(subId);

        const repository = new GetSubtaskRepository(db);
        const service = new GetSubtaskService(repository);
        const subtask = await service.find(userId, parentTaskId, subtaskId);

        if (!subtask) {
            return c.json({ message: "サブタスクが見つかりません。" }, HTTP_STATUS.NOT_FOUND);
        }

        return c.json({ message: "サブタスクを取得しました。", data: subtask }, HTTP_STATUS.OK);
    }
);

export { getSubtask };
