import { FrontUserId } from "../../../domain";
import { BulkUpdateTodoSchemaType } from "../schema/bulk-update-todo.schema";

/**
 * タスク一括更新リポジトリインターフェース
 */
export interface IBulkUpdateTodoRepository {
  /**
   * タスクを一括更新
   */
  bulkUpdate(userId: FrontUserId, query: BulkUpdateTodoSchemaType, now: string): Promise<void>;
}
