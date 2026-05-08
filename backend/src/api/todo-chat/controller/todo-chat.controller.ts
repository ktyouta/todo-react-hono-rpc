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

        // AIテキストを出力
        const message = await service.chat(userMessage);

        // AI出力の安全チェック
        const isSafe = await service.checkOutput(message);
        if (!isSafe) {
            return c.json(
                { message: "回答を生成しました。", data: { message: "その質問にはお答えできません。" } },
                HTTP_STATUS.OK
            );
        }

        return c.json({ message: "回答を生成しました。", data: message }, HTTP_STATUS.OK);
    }
);

export { todoChat };
