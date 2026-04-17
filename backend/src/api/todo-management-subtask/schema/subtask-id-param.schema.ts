import { z } from "zod";

/**
 * サブタスクIDパラメータスキーマ（親タスクID + サブタスクID）
 */
export const SubtaskIdParamSchema = z.object({
  id: z.coerce.number({ invalid_type_error: "タスクIDは数値で指定してください" }).int().positive(),
  subId: z.coerce.number({ invalid_type_error: "サブタスクIDは数値で指定してください" }).int().positive(),
});

export type SubtaskIdParamSchemaType = z.infer<typeof SubtaskIdParamSchema>;
