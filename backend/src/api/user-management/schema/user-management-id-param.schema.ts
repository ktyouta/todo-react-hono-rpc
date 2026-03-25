import { z } from "zod";

/**
 * ユーザー管理IDパラメータスキーマ
 */
export const UserManagementIdParamSchema = z.object({
    id: z.coerce.number({ invalid_type_error: "ユーザーIDは数値で指定してください" }).int().positive(),
});

export type UserManagementIdParamSchemaType = z.infer<typeof UserManagementIdParamSchema>;
