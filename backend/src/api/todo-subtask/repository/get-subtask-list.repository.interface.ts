import { FrontUserId, TaskId } from "../../../domain";

export type SubtaskListItem = {
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
 * サブタスク一覧取得リポジトリインターフェース
 */
export interface IGetSubtaskListRepository {
  /**
   * サブタスク一覧取得
   */
  findAll(userId: FrontUserId, parentTaskId: TaskId): Promise<SubtaskListItem[]>;
}
