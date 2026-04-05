import { z } from "zod";

/**
 * タスク一括削除（管理者用）リクエストスキーマ
 */
export const BulkDeleteTodoManagementSchema = z.object({
  ids: z
    .array(z.number().int().positive())
    .min(1, "削除対象のタスクIDを1件以上指定してください"),
});

export type BulkDeleteTodoManagementSchemaType = z.infer<typeof BulkDeleteTodoManagementSchema>;
