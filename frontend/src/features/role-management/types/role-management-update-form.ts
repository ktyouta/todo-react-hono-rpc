import { z } from "zod";

export const RoleManagementUpdateSchema = z.object({
    name: z
        .string()
        .nonempty("ロール名を入力してください")
        .max(50, "ロール名は50文字以内で入力してください"),
    permissionIds: z.array(z.number().int().positive()),
});

export type RoleManagementUpdateFormType = z.infer<typeof RoleManagementUpdateSchema>;
