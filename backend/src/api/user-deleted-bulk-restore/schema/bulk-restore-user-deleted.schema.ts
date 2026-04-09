import { z } from "zod";

/**
 * 削除済みユーザー一括復元（管理者用）リクエストスキーマ
 */
export const BulkRestoreUserDeletedSchema = z
  .object({
    ids: z
      .array(z.number().int().positive())
      .min(1, "復元対象のユーザーIDを1件以上指定してください"),
  });

export type BulkRestoreUserDeletedSchemaType = z.infer<typeof BulkRestoreUserDeletedSchema>;
