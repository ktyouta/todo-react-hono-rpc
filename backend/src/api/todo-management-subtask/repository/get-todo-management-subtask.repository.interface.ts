import { TaskId } from "../../../domain";

export type ManagementSubtaskItem = {
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
  parentTitle: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * サブタスク詳細取得リポジトリインターフェース
 */
export interface IGetTodoManagementSubtaskRepository {
  /**
   * サブタスク取得
   */
  find(parentTaskId: TaskId, subtaskId: TaskId): Promise<ManagementSubtaskItem | undefined>;
}
