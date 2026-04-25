import type { FrontUserId } from "../../../domain";
import type { ValidatedRow } from "../service/import-todo.service";

export type ImportResult = {
  successCount: number;
};

/**
 * タスクCSVインポートリポジトリインターフェース
 */
export interface IImportTodoRepository {
  /**
   * 指定IDのタスクが対象ユーザーに属するか確認する
   * 存在しない・他ユーザーのIDはエラー行として返す
   */
  findInvalidIds(userId: FrontUserId, ids: number[]): Promise<{ id: number }[]>;

  /**
   * バリデーション済み行を一括更新する
   */
  bulkUpdate(userId: FrontUserId, rows: ValidatedRow[], now: string): Promise<void>;
}
