import { z } from "zod";

/**
 * ユーザー一括削除（管理者用）リクエストスキーマ
 */
export const BulkDeleteUserManagementSchema = z.object({
    ids: z
        .array(z.number().int().positive())
        .min(1, "削除対象のユーザーIDを1件以上指定してください"),
});

export type BulkDeleteUserManagementSchemaType = z.infer<typeof BulkDeleteUserManagementSchema>;
