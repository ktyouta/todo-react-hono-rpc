import { z } from "zod";

/**
 * タスク作成アシストリクエストスキーマ
 * タイトルまたは詳細のどちらか一方以上が必須
 */
export const TodoAssistSchema = z
    .object({
        title: z
            .string()
            .max(200, "タイトルは200文字以内で入力してください")
            .optional(),
        content: z
            .string()
            .max(2000, "タスク内容は2000文字以内で入力してください")
            .optional(),
    })
    .refine(
        (data) => (data.title?.trim() ?? "").length > 0 || (data.content?.trim() ?? "").length > 0,
        { message: "タイトルまたはタスク内容のどちらかを入力してください" }
    );

export type TodoAssistSchemaType = z.infer<typeof TodoAssistSchema>;
