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

export type TodoListResult = {
  list: TodoListItem[];
  total: number;
};

/**
 * タスク一覧取得リポジトリインターフェース
 */
export interface IGetTodoListRepository {
  /**
   * 一覧取得
   */
  findAll(userId: FrontUserId, query: GetTodoListQuerySchemaType): Promise<TodoListItem[]>;
  /**
   * 総件数取得
   */
  count(userId: FrontUserId, query: GetTodoListQuerySchemaType): Promise<number>;
}
