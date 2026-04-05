import { and, eq, inArray } from "drizzle-orm";
import { FrontUserId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { taskTransaction } from "../../../infrastructure/db";
import { IBulkDeleteTodoRepository } from "./bulk-delete-todo.repository.interface";

/**
 * タスク一括削除リポジトリ実装
 */
export class BulkDeleteTodoRepository implements IBulkDeleteTodoRepository {
  constructor(private readonly db: Database) {}

  /**
   * お気に入りタスクのIDを取得
   */
  async findFavoriteIds(userId: FrontUserId, ids: number[]): Promise<number[]> {
    const result = await this.db
      .select({ id: taskTransaction.id })
      .from(taskTransaction)
      .where(
        and(
          eq(taskTransaction.userId, userId.value),
          eq(taskTransaction.deleteFlg, false),
          eq(taskTransaction.isFavorite, true),
          inArray(taskTransaction.id, ids)
        )
      );
    return result.map((r) => r.id);
  }

  /**
   * タスクを一括論理削除
   */
  async bulkDelete(userId: FrontUserId, ids: number[], now: string): Promise<void> {
    await this.db
      .update(taskTransaction)
      .set({ deleteFlg: true, updatedAt: now })
      .where(
        and(
          eq(taskTransaction.userId, userId.value),
          eq(taskTransaction.deleteFlg, false),
          inArray(taskTransaction.id, ids)
        )
      );
  }
}
