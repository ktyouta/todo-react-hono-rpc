import { z } from "zod";

export const UserManagementPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(8, "パスワードは8文字以上で入力してください")
        .regex(/^[\x21-\x7E]+$/, "パスワードは半角英数記号で入力してください"),
});

export type UserManagementPasswordFormType = z.infer<typeof UserManagementPasswordSchema>;
