import { FrontUserId } from "../../../domain";
import { GetTodoListQuerySchemaType } from "../schema/get-todo-list-query.schema";

export type TodoListItem = {
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
  findAll(userId: FrontUserId, query: GetTodoListQuerySchemaType): Promise<TodoListItem[]>;
}
