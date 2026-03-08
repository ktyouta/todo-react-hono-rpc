import { z } from "zod";

/**
 * タスク更新リクエストスキーマ
 */
export const UpdateTodoSchema = z
  .object({
    title: z
      .string()
      .min(1, "タイトルを入力してください")
      .max(200, "タイトルは200文字以内で入力してください"),
    content: z
      .string()
      .min(1, "タスク内容を入力してください")
      .max(2000, "タスク内容は2000文字以内で入力してください"),
    category: z.number().int().min(1),
    priority: z.number().int().optional(),
    status: z.number().int().optional(),
  });

export type UpdateTodoSchemaType = z.infer<typeof UpdateTodoSchema>;
