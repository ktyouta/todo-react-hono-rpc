import { FrontUserId } from "../../../domain";
import { TaskId } from "../../../domain/task-id";

export type TodoItem = {
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
  isFavorite: boolean;
  deleteFlg: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * タスク一覧取得リポジトリインターフェース
 */
export interface IGetTodoRepository {
  /**
   * タスク取得
   */
  find(userId: FrontUserId, taskId: TaskId): Promise<TodoItem | undefined>;
}
