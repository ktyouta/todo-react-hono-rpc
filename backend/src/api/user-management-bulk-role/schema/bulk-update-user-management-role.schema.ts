import { z } from "zod";

/**
 * ユーザー一括ロール変更（管理者用）リクエストスキーマ
 */
export const BulkUpdateUserManagementRoleSchema = z.object({
    ids: z
        .array(z.number().int().positive())
        .min(1, "変更対象のユーザーIDを1件以上指定してください"),
    roleId: z.number().int().positive(),
});

export type BulkUpdateUserManagementRoleSchemaType = z.infer<typeof BulkUpdateUserManagementRoleSchema>;
