import { z } from "zod";

/**
 * ゴミ箱タスク一括復元リクエストスキーマ（一般ユーザー用）
 */
export const BulkRestoreTodoTrashSchema = z.object({
    ids: z
        .array(z.number().int().positive())
        .min(1, "復元対象のタスクIDを1件以上指定してください"),
});

export type BulkRestoreTodoTrashSchemaType = z.infer<typeof BulkRestoreTodoTrashSchema>;
