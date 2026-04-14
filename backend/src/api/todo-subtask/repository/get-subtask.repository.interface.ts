import { FrontUserId, TaskId } from "../../../domain";
import type { SubtaskListItem } from "./get-subtask-list.repository.interface";

/**
 * サブタスク詳細取得リポジトリインターフェース
 */
export interface IGetSubtaskRepository {
  /**
   * サブタスク取得
   */
  find(userId: FrontUserId, parentTaskId: TaskId, subtaskId: TaskId): Promise<SubtaskListItem | undefined>;
}
