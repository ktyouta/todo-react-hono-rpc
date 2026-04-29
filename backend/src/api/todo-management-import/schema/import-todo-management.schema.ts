import { z } from "zod";

/**
 * タスク管理CSVインポートリクエストスキーマ
 */
export const ImportTodoManagementFormSchema = z.object({
  file: z.instanceof(File),
});

export type ImportTodoManagementFormSchemaType = z.infer<typeof ImportTodoManagementFormSchema>;
