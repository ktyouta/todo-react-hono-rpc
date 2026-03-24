import { TaskId } from "../../../domain/task-id";

/**
 * 削除済みタスク取得リポジトリの戻り値型（管理者用）
 */
export type TodoDeletedItem = {
    id: number;
    title: string;
    content: string | null;
    categoryId: number;
    categoryName: string;
    statusId: number | null;
    statusName: string;
    priorityId: number | null;
    priorityName: string;
    dueDate: string | null;
    userId: number | null;
    userName: string;
    deleteFlg: boolean;
    createdAt: string;
    updatedAt: string;
};

export interface IGetTodoDeletedRepository {
    find(taskId: TaskId): Promise<TodoDeletedItem | undefined>;
}
