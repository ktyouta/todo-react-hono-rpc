import { z } from "zod";

/**
 * タスク一括復元（管理者用）リクエストスキーマ
 */
export const BulkRestoreTodoSchema = z
  .object({
    ids: z
      .array(z.number().int().positive())
      .min(1, "復元対象のタスクIDを1件以上指定してください"),
  });

export type BulkRestoreTodoSchemaType = z.infer<typeof BulkRestoreTodoSchema>;
