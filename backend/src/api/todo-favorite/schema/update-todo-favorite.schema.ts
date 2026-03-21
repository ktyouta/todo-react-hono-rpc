import { z } from "zod";

/**
 * お気に入りトグルリクエストスキーマ
 */
export const UpdateTodoFavoriteSchema = z.object({
    isFavorite: z.boolean(),
});

export type UpdateTodoFavoriteSchemaType = z.infer<typeof UpdateTodoFavoriteSchema>;
