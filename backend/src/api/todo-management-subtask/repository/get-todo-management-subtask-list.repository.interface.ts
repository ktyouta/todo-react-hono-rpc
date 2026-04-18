import { TaskId } from "../../../domain";
import { GetTodoManagementSubtaskListQuerySchemaType } from "../schema/get-todo-management-subtask-list-query.schema";

export type ManagementSubtaskListItem = {
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
  isFavorite: boolean;
  deleteFlg: boolean;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ManagementSubtaskListResult = {
  list: ManagementSubtaskListItem[];
  total: number;
};

/**
 * サブタスク一覧取得リポジトリインターフェース（管理者用）
 */
export interface IGetTodoManagementSubtaskListRepository {
  /**
   * サブタスク一覧取得（ユーザーフィルタなし）
   */
  findAll(parentTaskId: TaskId, query: GetTodoManagementSubtaskListQuerySchemaType): Promise<ManagementSubtaskListItem[]>;
  /**
   * サブタスク件数取得
   */
  count(parentTaskId: TaskId): Promise<number>;
}
