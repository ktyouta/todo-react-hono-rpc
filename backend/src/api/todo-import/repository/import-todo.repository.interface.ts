import type { FrontUserId } from "../../../domain";
import type { ValidatedRow } from "../service/import-todo.service";

export type TaskResult = {
  id: number;
};

/**
 * タスクCSVインポートリポジトリインターフェース
 */
export interface IImportTodoRepository {
  /**
   * タスク一覧を取得
   */
  findTasks(userId: FrontUserId, ids: number[]): Promise<TaskResult[]>;

  /**
   * バリデーション済み行を一括更新する
   */
  bulkUpdate(userId: FrontUserId, rows: ValidatedRow[], now: string): Promise<void>;
}
