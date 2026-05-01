import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { TodoAssistSchema } from "../schema";
import { TodoAssistService } from "../service";


/**
 * タスク作成アシスト
 * @route POST /api/v1/todo-assist
 */
const todoAssist = new Hono<AppEnv>().post(
    API_ENDPOINT.TODO_ASSIST,
    authMiddleware,
    zValidator("json", TodoAssistSchema, (result, c) => {
        if (!result.success) {
            const data = formatZodErrors(result.error);
            const message = data.map((e) => e.message);
            return c.json({ message, data }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const service = new TodoAssistService(c.env.AI);

        // メッセージ作成
        const userMessage = service.buildUserMessage(c.req.valid("json"));

        // AIテキストを出力
        const rawText = await service.assist(userMessage);

        // 出力テキストをパース
        const assisted = service.parseAiResponse(rawText);

        // AI出力の安全チェック
        await service.checkOutput(assisted);

        return c.json({ message: "タスク案を生成しました。", data: assisted }, HTTP_STATUS.OK);
    }
);

export { todoAssist };
