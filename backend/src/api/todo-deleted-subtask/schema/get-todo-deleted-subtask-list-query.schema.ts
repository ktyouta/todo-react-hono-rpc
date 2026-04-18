import { z } from "zod";

/**
 * 削除タスク管理サブタスク一覧取得クエリパラメータスキーマ（管理者用）
 */
export const GetTodoDeletedSubtaskListQuerySchema = z.object({
    page: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.coerce.number().int().positive().default(1)
    ),
});

export type GetTodoDeletedSubtaskListQuerySchemaType = z.infer<typeof GetTodoDeletedSubtaskListQuerySchema>;
