import { z } from "zod";

/**
 * タスクCSVインポートリクエストスキーマ
 */
export const ImportTodoFormSchema = z.object({
  file: z.instanceof(File),
});

export type ImportTodoFormSchemaType = z.infer<typeof ImportTodoFormSchema>;
