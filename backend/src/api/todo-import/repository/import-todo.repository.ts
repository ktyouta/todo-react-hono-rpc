import { and, eq, inArray } from "drizzle-orm";
import type { FrontUserId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { taskTransaction } from "../../../infrastructure/db";
import type { ValidatedRow } from "../service/import-todo.service";
import type { IImportTodoRepository } from "./import-todo.repository.interface";

/**
 * タスクCSVインポートリポジトリ実装
 */
export class ImportTodoRepository implements IImportTodoRepository {
  constructor(private readonly db: Database) {}

  /**
   * 指定IDのうち、対象ユーザーに属さない（存在しない・他ユーザー・削除済み）IDを返す
   */
  async findInvalidIds(userId: FrontUserId, ids: number[]): Promise<number[]> {
    const rows = await this.db
      .select({ id: taskTransaction.id })
      .from(taskTransaction)
      .where(
        and(
          eq(taskTransaction.userId, userId.value),
          eq(taskTransaction.deleteFlg, false),
          inArray(taskTransaction.id, ids),
        )
      );

    const validIdSet = new Set(rows.map((r) => r.id));
    return ids.filter((id) => !validIdSet.has(id));
  }

  /**
   * バリデーション済み行を順次更新する
   */
  async bulkUpdate(userId: FrontUserId, rows: ValidatedRow[], now: string): Promise<void> {
    for (const row of rows) {
      await this.db
        .update(taskTransaction)
        .set({
          title: row.title,
          content: row.content,
          categoryId: row.categoryId,
          statusId: row.statusId,
          priorityId: row.priorityId,
          dueDate: row.dueDate,
          isFavorite: row.isFavorite,
          updatedAt: now,
        })
        .where(
          and(
            eq(taskTransaction.id, row.id),
            eq(taskTransaction.userId, userId.value),
            eq(taskTransaction.deleteFlg, false),
          )
        );
    }
  }
}
