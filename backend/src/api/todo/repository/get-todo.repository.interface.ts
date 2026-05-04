import { FrontUserId } from "../../../domain";
import { TaskId } from "../../../domain/task-id";

export type AncestorItem = {
  id: number;
  title: string;
};

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
  parentId: number | null;
  parentTitle: string | null;
};

/**
 * タスク一覧取得リポジトリインターフェース
 */
export interface IGetTodoRepository {
  /**
   * タスク取得
   */
  find(userId: FrontUserId, taskId: TaskId): Promise<TodoItem | undefined>;
  /**
   * 祖先タスク取得（ルート→直近の親の順）
   */
  findAncestors(parentId: number): Promise<AncestorItem[]>;
}
