import { z } from "zod";

const coerceOptionalId = z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.coerce.number({ invalid_type_error: "IDは数値で指定してください" }).int().positive().optional()
);

/**
 * 削除済みユーザー一覧取得クエリパラメータスキーマ（管理者用）
 */
export const GetUserDeletedListQuerySchema = z.object({
    name: z.string().optional(),
    roleId: coerceOptionalId,
    createdAtFrom: z.string().optional(),
    createdAtTo: z.string().optional(),
    updatedAtFrom: z.string().optional(),
    updatedAtTo: z.string().optional(),
    page: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.coerce.number().int().positive().default(1)
    ),
});

export type GetUserDeletedListQuerySchemaType = z.infer<typeof GetUserDeletedListQuerySchema>;
