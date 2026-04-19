import { FrontUserId, TaskId } from "../../../domain";

export type SubtaskItem = {
  id: number;
};

/**
 * サブタスク削除リポジトリインターフェース
 */
export interface IDeleteSubtaskRepository {
  /**
   * サブタスク取得
   */
  find(userId: FrontUserId, parentTaskId: TaskId, subtaskId: TaskId): Promise<SubtaskItem | undefined>;
}
