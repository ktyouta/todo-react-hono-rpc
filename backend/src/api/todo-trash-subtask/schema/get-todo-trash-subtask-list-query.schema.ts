import { z } from "zod";

/**
 * ゴミ箱サブタスク一覧取得クエリパラメータスキーマ（一般ユーザー用）
 */
export const GetTodoTrashSubtaskListQuerySchema = z.object({
    page: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.coerce.number().int().positive().default(1)
    ),
});

export type GetTodoTrashSubtaskListQuerySchemaType = z.infer<typeof GetTodoTrashSubtaskListQuerySchema>;
