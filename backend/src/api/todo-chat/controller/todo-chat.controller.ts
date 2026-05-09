import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { TodoChatSchema } from "../schema";
import { TodoChatService } from "../service";


/**
 * AIチャット
 * @route POST /api/v1/todo-chat
 */
const todoChat = new Hono<AppEnv>().post(
    API_ENDPOINT.TODO_CHAT,
    authMiddleware,
    zValidator("json", TodoChatSchema, (result, c) => {
        if (!result.success) {
            const data = formatZodErrors(result.error);
            const message = data.map((e) => e.message);
            return c.json({ message, data }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const service = new TodoChatService(c.env.AI);

        // メッセージ作成
        const userMessage = service.buildUserMessage(c.req.valid("json"));

        // Workers AI ストリームを取得し、独自 SSE 形式に変換して返す
        const aiStream = await service.chatStream(userMessage);

        return c.body(aiStream.pipeThrough(service.createSseTransformStream()), {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    }
);

export { todoChat };
