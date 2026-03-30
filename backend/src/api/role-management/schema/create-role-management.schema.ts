import { z } from "zod";

export const CreateRoleManagementSchema = z.object({
    name: z
        .string()
        .min(1, "ロール名を入力してください")
        .max(50, "ロール名は50文字以内で入力してください"),
    permissionIds: z
        .array(z.number({ invalid_type_error: "パーミッションIDは数値で指定してください" }).int().positive())
        .default([]),
});

export type CreateRoleManagementSchemaType = z.infer<typeof CreateRoleManagementSchema>;
