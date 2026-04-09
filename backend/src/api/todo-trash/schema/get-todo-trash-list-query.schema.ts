import { z } from "zod";

const coerceOptionalId = z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.coerce.number({ invalid_type_error: "IDは数値で指定してください" }).int().positive().optional()
);

/**
 * ゴミ箱タスク一覧取得クエリパラメータスキーマ（一般ユーザー用）
 */
export const GetTodoTrashListQuerySchema = z.object({
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

export type GetTodoTrashListQuerySchemaType = z.infer<typeof GetTodoTrashListQuerySchema>;
