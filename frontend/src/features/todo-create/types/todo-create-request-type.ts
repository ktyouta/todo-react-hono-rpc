import { z } from "zod";

export const TodoCreateRequestSchema = z.object({
    title: z
        .string()
        .min(1, "タイトルを入力してください")
        .max(200, "タイトルは200文字以内で入力してください"),
    content: z
        .string()
        .min(1, "タスク内容を入力してください")
        .max(2000, "タスク内容は2000文字以内で入力してください"),
});

export type TodoCreateRequestType = z.infer<typeof TodoCreateRequestSchema>;
