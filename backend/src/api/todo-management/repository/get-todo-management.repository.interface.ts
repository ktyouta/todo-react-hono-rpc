import { TaskId } from "../../../domain/task-id";

export type AncestorItem = {
    id: number;
    title: string;
};

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
    parentId: number | null;
    parentTitle: string | null;
};

export interface IGetTodoManagementRepository {
    find(taskId: TaskId): Promise<TodoManagementItem | undefined>;
    /**
     * 祖先タスク取得（ルート→直近の親の順）
     */
    findAncestors(parentId: number): Promise<AncestorItem[]>;
}
