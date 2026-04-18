import { z } from "zod";

/**
 * サブタスク一覧取得クエリパラメータスキーマ
 */
export const GetSubtaskListQuerySchema = z.object({
    page: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.coerce.number().int().positive().default(1)
    ),
});

export type GetSubtaskListQuerySchemaType = z.infer<typeof GetSubtaskListQuerySchema>;
