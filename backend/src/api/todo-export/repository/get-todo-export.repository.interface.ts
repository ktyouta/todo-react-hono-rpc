import { FrontUserId } from "../../../domain";
import { GetTodoExportQuerySchemaType } from "../schema/get-todo-export-query.schema";

export type TodoExportItem = {
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
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
};

/**
 * タスクCSVエクスポートリポジトリインターフェース
 */
export interface IGetTodoExportRepository {
    /**
     * エクスポート対象の全件取得（ページネーションなし）
     */
    findAll(userId: FrontUserId, query: GetTodoExportQuerySchemaType): Promise<TodoExportItem[]>;
}
