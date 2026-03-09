import { z } from "zod";

/**
 * タスク作成リクエストスキーマ
 */
export const CreateTodoSchema = z
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
    status: z.number().int().optional(),
    priority: z.number().int().optional(),
    dueDate: z.string().nullable().optional(),
  });

export type CreateTodoSchemaType = z.infer<typeof CreateTodoSchema>;
