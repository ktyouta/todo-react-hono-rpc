import { z } from "zod";

const coerceOptionalId = z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.coerce.number({ invalid_type_error: "IDは数値で指定してください" }).int().positive().optional()
);

/**
 * タスク一覧取得クエリパラメータスキーマ（管理者用）
 */
export const GetTodoManagementListQuerySchema = z.object({
    userId: coerceOptionalId,
    title: z.string().optional(),
    categoryId: coerceOptionalId,
    statusId: coerceOptionalId,
    priorityId: coerceOptionalId,
    dueDateFrom: z.string().optional(),
    dueDateTo: z.string().optional(),
    createdAtFrom: z.string().optional(),
    createdAtTo: z.string().optional(),
    updatedAtFrom: z.string().optional(),
    updatedAtTo: z.string().optional(),
    page: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.coerce.number().int().positive().default(1)
    ),
});

export type GetTodoManagementListQuerySchemaType = z.infer<typeof GetTodoManagementListQuerySchema>;
