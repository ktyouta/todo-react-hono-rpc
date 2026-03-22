import { z } from "zod";

const coerceOptionalId = z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.coerce.number({ invalid_type_error: "IDは数値で指定してください" }).int().positive().optional()
);

/**
 * タスク一覧取得クエリパラメータスキーマ
 */
export const GetTodoListQuerySchema = z.object({
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
    isFavorite: z.preprocess(
        (v) => {
            return v === `true`
        },
        z.boolean()
    ),
});

export type GetTodoListQuerySchemaType = z.infer<typeof GetTodoListQuerySchema>;
