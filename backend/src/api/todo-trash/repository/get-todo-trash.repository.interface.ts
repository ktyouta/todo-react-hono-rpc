import { FrontUserId } from "../../../domain";
import { TaskId } from "../../../domain/task-id";

/**
 * ゴミ箱タスク取得リポジトリの戻り値型（一般ユーザー用）
 */
export type TodoTrashItem = {
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
    deleteFlg: boolean;
    parentId: number | null;
    parentTitle: string | null;
    createdAt: string;
    updatedAt: string;
};

export interface IGetTodoTrashRepository {
    find(taskId: TaskId, userId: FrontUserId): Promise<TodoTrashItem | undefined>;
}
