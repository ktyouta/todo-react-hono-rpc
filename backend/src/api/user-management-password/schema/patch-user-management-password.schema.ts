import { z } from "zod";

/**
 * パスワードリセットリクエストスキーマ
 */
export const PatchUserManagementPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(8, "パスワードは8文字以上で入力してください")
        .regex(/^[\x21-\x7E]+$/, "パスワードは半角英数記号で入力してください"),
});

export type PatchUserManagementPasswordSchemaType = z.infer<typeof PatchUserManagementPasswordSchema>;
