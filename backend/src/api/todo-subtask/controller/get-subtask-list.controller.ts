import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskId } from "../../../domain";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { TaskIdParamSchema } from "../../todo/schema/task-id-param.schema";
import { GetSubtaskListRepository } from "../repository/get-subtask-list.repository";
import { GetSubtaskListQuerySchema } from "../schema/get-subtask-list-query.schema";
import { GetSubtaskListService } from "../service/get-subtask-list.service";

/**
 * アクティブなサブタスク一覧取得
 * @route GET /api/v1/todo/:id/subtasks
 */
const getSubtaskList = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_SUBTASK,
    authMiddleware,
    zValidator("param", TaskIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    zValidator("query", GetSubtaskListQuerySchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "クエリが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const userId = c.get("user")?.userId;
        const query = c.req.valid("query");

        if (!userId) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        const parentTaskId = new TaskId(c.req.valid("param").id);
        const repository = new GetSubtaskListRepository(db);
        const service = new GetSubtaskListService(repository);
        const { list, total } = await service.findAll(userId, parentTaskId, query);
        const totalPages = Math.ceil(total / GetSubtaskListRepository.LIMIT);

        return c.json({ message: "サブタスク一覧を取得しました。", data: { list, total, totalPages } }, HTTP_STATUS.OK);
    }
);

export { getSubtaskList };
