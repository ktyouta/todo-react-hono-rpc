import { z } from "zod";

/**
 * サブタスク一覧取得クエリパラメータスキーマ（管理者用）
 */
export const GetTodoManagementSubtaskListQuerySchema = z.object({
    page: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.coerce.number().int().positive().default(1)
    ),
});

export type GetTodoManagementSubtaskListQuerySchemaType = z.infer<typeof GetTodoManagementSubtaskListQuerySchema>;
