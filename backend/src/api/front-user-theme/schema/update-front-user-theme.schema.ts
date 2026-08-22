import { z } from "zod";

/**
 * ダークモード設定更新リクエストスキーマ
 */
export const UpdateFrontUserThemeSchema = z.object({
    darkMode: z.boolean(),
});

export type UpdateFrontUserThemeSchemaType = z.infer<typeof UpdateFrontUserThemeSchema>;
