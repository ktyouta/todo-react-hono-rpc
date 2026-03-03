import { z } from "zod";

export const TodoDetailEditSchema = z.object({
    title: z
        .string()
        .min(1, "タイトルを入力してください")
        .max(200, "タイトルは200文字以内で入力してください"),
    content: z
        .string()
        .min(1, "タスク内容を入力してください")
        .max(2000, "タスク内容は2000文字以内で入力してください"),
    categoryId: z.number().int().min(1),
    statusId: z.number().int().optional(),
});

export type TodoDetailEditType = z.infer<typeof TodoDetailEditSchema>;
