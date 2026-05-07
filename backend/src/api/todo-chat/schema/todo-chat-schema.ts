import { z } from "zod";

/**
 * AIチャットリクエストスキーマ
 */
export const TodoChatSchema = z.object({
    message: z
        .string()
        .trim()
        .min(1, "メッセージを入力してください")
        .max(2000, "メッセージは2000文字以内で入力してください"),
});

export type TodoChatSchemaType = z.infer<typeof TodoChatSchema>;
