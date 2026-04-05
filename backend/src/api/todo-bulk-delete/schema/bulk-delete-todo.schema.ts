import { z } from "zod";

/**
 * タスク一括削除リクエストスキーマ
 */
export const BulkDeleteTodoSchema = z.object({
  ids: z
    .array(z.number().int().positive())
    .min(1, "削除対象のタスクIDを1件以上指定してください"),
});

export type BulkDeleteTodoSchemaType = z.infer<typeof BulkDeleteTodoSchema>;
