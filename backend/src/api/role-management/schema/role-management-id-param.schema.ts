import { z } from "zod";

export const RoleManagementIdParamSchema = z.object({
    roleId: z.coerce.number({ invalid_type_error: "ロールIDは数値で指定してください" }).int().positive(),
});

export type RoleManagementIdParamSchemaType = z.infer<typeof RoleManagementIdParamSchema>;
