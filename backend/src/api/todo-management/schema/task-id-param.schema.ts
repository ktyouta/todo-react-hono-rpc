import { z } from "zod";

/**
 * タスクIDパラメータスキーマ
 */
export const TaskIdParamSchema = z.object({
  id: z.coerce.number({ invalid_type_error: "タスクIDは数値で指定してください" }).int().positive(),
});

export type TaskIdParamSchemaType = z.infer<typeof TaskIdParamSchema>;
