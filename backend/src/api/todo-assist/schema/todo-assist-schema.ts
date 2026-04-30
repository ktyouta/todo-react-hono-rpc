import { z } from "zod";

/**
 * タスク作成アシストリクエストスキーマ
 */
export const TodoAssistSchema = z
    .object({
        title: z
            .string()
            .min(1, "タイトルを入力してください")
            .max(200, "タイトルは200文字以内で入力してください"),
        content: z
            .string()
            .min(1, "タスク内容を入力してください")
            .max(2000, "タスク内容は2000文字以内で入力してください")
    });

export type TodoAssistSchemaType = z.infer<typeof TodoAssistSchema>;
