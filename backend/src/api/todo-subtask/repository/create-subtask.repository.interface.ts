import { FrontUserId, TaskId } from "../../../domain";

export type ParentTaskItem = {
  id: number;
};

/**
 * サブタスク作成リポジトリインターフェース
 */
export interface ICreateSubtaskRepository {
  /**
   * 親タスク取得（アクティブであることを確認）
   * @param userId
   * @param parentTaskId
   * @returns
   */
  find(userId: FrontUserId, parentTaskId: TaskId): Promise<ParentTaskItem | undefined>;
  /**
   * 祖先タスクID一覧を取得（親タスク自身からルートまで）
   * @param parentTaskId
   * @returns
   */
  findAncestorIds(parentTaskId: number): Promise<number[]>;
}
