import { FrontUserId } from "../../../domain";

export type TodoListItem = {
  id: number;
  title: string;
  content: string | null;
  categoryId: number;
  categoryName: string;
  statusId: number | null;
  statusName: string;
  dueDate: string | null;
  userId: number | null;
  deleteFlg: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * タスク一覧取得リポジトリインターフェース
 */
export interface IGetTodoListRepository {
  /**
   * 全件取得
   */
  findAll(userId: FrontUserId): Promise<TodoListItem[]>;
}
