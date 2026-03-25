import { z } from "zod";

/**
 * ロール変更リクエストスキーマ
 */
export const PatchUserManagementRoleSchema = z.object({
    roleId: z.number({ invalid_type_error: "ロールIDは数値で指定してください" }).int().positive(),
});

export type PatchUserManagementRoleSchemaType = z.infer<typeof PatchUserManagementRoleSchema>;
