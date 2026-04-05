import { FrontUserId } from "../../../domain";

/**
 * タスク一括削除リポジトリインターフェース
 */
export interface IBulkDeleteTodoRepository {
  /**
   * お気に入りタスクのIDを取得
   */
  findFavoriteIds(userId: FrontUserId, ids: number[]): Promise<number[]>;

  /**
   * タスクを一括論理削除
   */
  bulkDelete(userId: FrontUserId, ids: number[], now: string): Promise<void>;
}
