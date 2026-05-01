import { z } from "zod";

/**
 * サブタスク更新リクエストスキーマ
 */
export const UpdateSubtaskSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(200, "タイトルは200文字以内で入力してください"),
  content: z
    .string()
    .max(2000, "タスク内容は2000文字以内で入力してください")
    .optional(),
  category: z.number().int().min(1),
  status: z.number().int().optional(),
  priority: z.number().int().optional(),
  dueDate: z.string().nullable().optional(),
});

export type UpdateSubtaskSchemaType = z.infer<typeof UpdateSubtaskSchema>;
