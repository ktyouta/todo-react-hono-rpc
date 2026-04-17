import { TaskId } from "../../../domain";

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

/**
 * サブタスク一覧取得リポジトリインターフェース（管理者用）
 */
export interface IGetTodoManagementSubtaskListRepository {
  /**
   * サブタスク一覧取得（ユーザーフィルタなし）
   */
  findAll(parentTaskId: TaskId): Promise<ManagementSubtaskListItem[]>;
}
