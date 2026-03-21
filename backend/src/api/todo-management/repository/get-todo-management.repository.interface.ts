import { TaskId } from "../../../domain/task-id";

/**
 * タスク取得リポジトリの戻り値型（管理者用）
 */
export type TodoManagementItem = {
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

export interface IGetTodoManagementRepository {
    find(taskId: TaskId): Promise<TodoManagementItem | undefined>;
}
