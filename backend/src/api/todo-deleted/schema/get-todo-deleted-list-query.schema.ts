import { z } from "zod";

const coerceOptionalId = z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.coerce.number({ invalid_type_error: "IDは数値で指定してください" }).int().positive().optional()
);

/**
 * 削除済みタスク一覧取得クエリパラメータスキーマ（管理者用）
 */
export const GetTodoDeletedListQuerySchema = z.object({
    userId: coerceOptionalId,
    title: z.string().optional(),
    categoryId: coerceOptionalId,
    statusId: coerceOptionalId,
    priorityId: coerceOptionalId,
    dueDateFrom: z.string().optional(),
    dueDateTo: z.string().optional(),
    updatedAtFrom: z.string().optional(),
    updatedAtTo: z.string().optional(),
    page: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.coerce.number().int().positive().default(1)
    ),
});

export type GetTodoDeletedListQuerySchemaType = z.infer<typeof GetTodoDeletedListQuerySchema>;
