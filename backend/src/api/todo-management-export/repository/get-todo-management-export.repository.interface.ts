import { GetTodoManagementExportQuerySchemaType } from "../schema/get-todo-management-export-query.schema";

export type TodoManagementExportItem = {
    id: number;
    title: string;
    content: string | null;
    categoryId: string;
    categoryName: string;
    statusId: string;
    statusName: string;
    priorityId: string;
    priorityName: string;
    dueDate: string | null;
    userName: string;
    createdAt: string;
    updatedAt: string;
};

/**
 * タスク管理CSVエクスポートリポジトリインターフェース（管理者用）
 */
export interface IGetTodoManagementExportRepository {
    /**
     * エクスポート対象の全件取得（ページネーションなし）
     */
    findAll(query: GetTodoManagementExportQuerySchemaType): Promise<TodoManagementExportItem[]>;
}
