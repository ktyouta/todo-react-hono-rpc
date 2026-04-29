import type { ValidatedManagementRow } from "../service/import-todo-management.service";

export type TaskResult = {
  id: number;
};

/**
 * タスク管理CSVインポートリポジトリインターフェース
 */
export interface IImportTodoManagementRepository {
  /**
   * タスク一覧を取得（ユーザーID不問）
   */
  findTasks(ids: number[]): Promise<TaskResult[]>;

  /**
   * バリデーション済み行を一括更新する
   */
  bulkUpdate(rows: ValidatedManagementRow[], now: string): Promise<void>;
}
