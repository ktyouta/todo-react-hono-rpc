import { FrontUserId, TaskId } from "../../../domain";
import { GetSubtaskListQuerySchemaType } from "../schema/get-subtask-list-query.schema";

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

export type SubtaskListResult = {
  list: SubtaskListItem[];
  total: number;
};

/**
 * サブタスク一覧取得リポジトリインターフェース
 */
export interface IGetSubtaskListRepository {
  /**
   * サブタスク一覧取得
   */
  findAll(userId: FrontUserId, parentTaskId: TaskId, query: GetSubtaskListQuerySchemaType): Promise<SubtaskListItem[]>;
  /**
   * サブタスク件数取得
   */
  count(userId: FrontUserId, parentTaskId: TaskId): Promise<number>;
}
