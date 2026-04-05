import { z } from "zod";

/**
 * タスク一括更新（管理者用）リクエストスキーマ
 */
export const BulkUpdateTodoManagementSchema = z
  .object({
    ids: z
      .array(z.number().int().positive())
      .min(1, "更新対象のタスクIDを1件以上指定してください"),
    statusId: z.number().int().positive().optional(),
    categoryId: z.number().int().positive().optional(),
    priorityId: z.number().int().positive().optional(),
  })
  .refine(
    (data) =>
      data.statusId !== undefined ||
      data.categoryId !== undefined ||
      data.priorityId !== undefined,
    { message: "変更するフィールドを1つ以上指定してください" }
  );

export type BulkUpdateTodoManagementSchemaType = z.infer<typeof BulkUpdateTodoManagementSchema>;
