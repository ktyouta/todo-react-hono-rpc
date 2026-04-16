import { FrontUserId, TaskId } from "../../../domain";
import type { SubtaskListItem } from "./get-subtask-list.repository.interface";

/**
 * サブタスク詳細取得リポジトリの戻り値型
 */
export type SubtaskItem = SubtaskListItem & {
  parentTitle: string;
};

/**
 * サブタスク詳細取得リポジトリインターフェース
 */
export interface IGetSubtaskRepository {
  /**
   * サブタスク取得
   */
  find(userId: FrontUserId, parentTaskId: TaskId, subtaskId: TaskId): Promise<SubtaskItem | undefined>;
}
