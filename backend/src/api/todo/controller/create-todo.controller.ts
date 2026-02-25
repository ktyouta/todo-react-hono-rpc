import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { userOperationGuardMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../type";
import { formatZodErrors } from "../../../util";
import { CreateTodoSchema } from "../schema";


/**
 * タスク作成
 * @route POST /api/v1/frontuser
 */
const createFrontUser = new Hono<AppEnv>().post(
    API_ENDPOINT.TODO,
    userOperationGuardMiddleware,
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
        const config = c.get('envConfig');

        return c.json({ message: "タスクを追加しました。" }, HTTP_STATUS.CREATED);
    }
);

export { createFrontUser };

