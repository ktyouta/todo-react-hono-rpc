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
  constructor(private readonly db: Database) { }

  /**
   * タスク一覧を取得
   */
  async findTasks(userId: FrontUserId, ids: number[]) {
    const result = await this.db
      .select({ id: taskTransaction.id })
      .from(taskTransaction)
      .where(
        and(
          eq(taskTransaction.userId, userId.value),
          eq(taskTransaction.deleteFlg, false),
          inArray(taskTransaction.id, ids),
        )
      );

    return result;
  }

  /**
   * バリデーション済み行を一括更新する
   */
  async bulkUpdate(userId: FrontUserId, rows: ValidatedRow[], now: string): Promise<void> {
    const statements = rows.map((row) =>
      this.db
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
        )
    );

    await this.db.batch(statements as [typeof statements[0], ...typeof statements[0][]]);
  }
}
