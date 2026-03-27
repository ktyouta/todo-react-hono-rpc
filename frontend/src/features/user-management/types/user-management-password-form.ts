import { z } from "zod";

export const UserManagementPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(8, "パスワードは8文字以上で入力してください")
        .regex(/^[\x21-\x7E]+$/, "パスワードは半角英数記号で入力してください"),
    confirmPassword: z
        .string()
        .min(1, "確認用パスワードを入力してください"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
});

export type UserManagementPasswordFormType = z.infer<typeof UserManagementPasswordSchema>;
