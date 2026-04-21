import { z } from "zod";

const coerceOptionalId = z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.coerce.number({ invalid_type_error: "IDは数値で指定してください" }).int().positive().optional()
);

/**
 * タスクCSVエクスポートクエリパラメータスキーマ
 */
export const GetTodoExportQuerySchema = z.object({
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
    isFavorite: z.preprocess(
        (v) => v === `true`,
        z.boolean()
    ),
});

export type GetTodoExportQuerySchemaType = z.infer<typeof GetTodoExportQuerySchema>;
