import { FrontUserId, TaskId } from "../../../domain";

export type ParentTaskItem = {
  id: number;
};

/**
 * 親タスク取得リポジトリインターフェース
 */
export interface IGetParentTaskRepository {
  /**
   * 親タスク取得（ルートタスクかつアクティブであることを確認）
   */
  find(userId: FrontUserId, parentTaskId: TaskId): Promise<ParentTaskItem | undefined>;
}
