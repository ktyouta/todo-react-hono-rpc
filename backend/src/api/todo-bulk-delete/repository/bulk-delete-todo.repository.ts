import { and, eq, inArray, sql } from "drizzle-orm";
import { FrontUserId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { taskTransaction } from "../../../infrastructure/db";
import { IBulkDeleteTodoRepository } from "./bulk-delete-todo.repository.interface";

/**
 * タスク一括削除リポジトリ実装
 */
export class BulkDeleteTodoRepository implements IBulkDeleteTodoRepository {
  constructor(private readonly db: Database) { }

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
    const valuesSql = sql.join(ids.map(id => sql`(${id})`), sql`, `);
    await this.db.run(sql`
      WITH RECURSIVE
      base_ids(id) AS (VALUES ${valuesSql}),
      descendants(id) AS (
        SELECT id FROM task_transaction WHERE id IN (SELECT id FROM base_ids)
        UNION ALL
        SELECT t.id FROM task_transaction t
        INNER JOIN descendants d ON t.parent_id = d.id
      )
      UPDATE task_transaction
      SET delete_flg = 1, updated_at = ${now}
      WHERE id IN (SELECT id FROM descendants)
      AND user_id = ${userId.value}
      AND delete_flg = 0
    `);
  }
}
