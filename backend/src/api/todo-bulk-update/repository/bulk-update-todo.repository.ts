import { and, eq, inArray, ne } from "drizzle-orm";
import { CategoryType, FrontUserId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { taskTransaction } from "../../../infrastructure/db";
import { BulkUpdateTodoSchemaType } from "../schema/bulk-update-todo.schema";
import { IBulkUpdateTodoRepository } from "./bulk-update-todo.repository.interface";

/**
 * タスク一括更新リポジトリ実装
 */
export class BulkUpdateTodoRepository implements IBulkUpdateTodoRepository {
  constructor(private readonly db: Database) { }

  /**
   * タスクを一括更新
   *
   * カテゴリ変更ルール:
   * - categoryId = メモ → statusId / priorityId を null にクリア
   * - categoryId = タスク等 → リクエストの statusId / priorityId をセット
   * - categoryId 未指定 → WHERE に ne 条件を追加してメモタスクをスキップ
   */
  async bulkUpdate(userId: FrontUserId, query: BulkUpdateTodoSchemaType, now: string): Promise<void> {
    const { ids, categoryId, statusId, priorityId } = query;
    const isMemo = categoryId === CategoryType.memo;

    await this.db
      .update(taskTransaction)
      .set({
        ...(categoryId !== undefined && { categoryId }),
        ...(isMemo
          ? { statusId: null, priorityId: null }
          : {
              ...(statusId !== undefined && { statusId }),
              ...(priorityId !== undefined && { priorityId }),
            }),
        updatedAt: now,
      })
      .where(
        and(
          eq(taskTransaction.userId, userId.value),
          eq(taskTransaction.deleteFlg, false),
          inArray(taskTransaction.id, ids),
          // カテゴリ変更なしの場合、メモタスクをスキップ
          ...(categoryId === undefined
            ? [ne(taskTransaction.categoryId, CategoryType.memo)]
            : []),
        )
      );
  }
}
