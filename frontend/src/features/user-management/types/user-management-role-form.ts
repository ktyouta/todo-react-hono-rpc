import { z } from "zod";

export const UserManagementRoleSchema = z.object({
    roleId: z.number({ invalid_type_error: "ロールを選択してください" }).int().positive(),
});

export type UserManagementRoleFormType = z.infer<typeof UserManagementRoleSchema>;
