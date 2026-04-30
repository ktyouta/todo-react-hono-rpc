import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { TaskContent, TaskTitle } from "../../../domain";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { TodoAssistSchema } from "../schema/todo-assist-schema";

/**
 * タスク作成アシスト
 * @route GET /api/v1/todo-assist
 */
const todoAssist = new Hono<AppEnv>().get(
    API_ENDPOINT.TODO_ASSIST,
    authMiddleware,
    zValidator("query", TodoAssistSchema, (result, c) => {
        if (!result.success) {
            const data = formatZodErrors(result.error);
            const message = data.map((e) => e.message);
            return c.json({ message, data }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const body = c.req.valid("query");
        //const ai = c.env.AI;
        const taskTitle = new TaskTitle(body.title);
        const taskContent = new TaskContent(body.content);

        // const aiResult = await ai.run("@cf/meta/llama-3-8b-instruct", {
        //     messages: [{ role: "user", content: `` }],
        // });

        return c.json({ message: "タスク案を生成しました。", data: '' }, HTTP_STATUS.CREATED);
    }
);

export { todoAssist };

