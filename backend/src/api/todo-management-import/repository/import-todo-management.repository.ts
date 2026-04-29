import { and, eq, inArray } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import { taskTransaction } from "../../../infrastructure/db";
import type { ValidatedManagementRow } from "../service/import-todo-management.service";
import type { IImportTodoManagementRepository } from "./import-todo-management.repository.interface";

/**
 * タスク管理CSVインポートリポジトリ実装（管理者用）
 */
export class ImportTodoManagementRepository implements IImportTodoManagementRepository {
  constructor(private readonly db: Database) { }

  /**
   * タスク一覧を取得
   */
  async findTasks(ids: number[]) {
    const result = await this.db
      .select({ id: taskTransaction.id })
      .from(taskTransaction)
      .where(
        and(
          eq(taskTransaction.deleteFlg, false),
          inArray(taskTransaction.id, ids),
        )
      );

    return result;
  }

  /**
   * バリデーション済み行を一括更新する
   */
  async bulkUpdate(rows: ValidatedManagementRow[], now: string): Promise<void> {
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
          updatedAt: now,
        })
        .where(
          and(
            eq(taskTransaction.id, row.id),
            eq(taskTransaction.deleteFlg, false),
          )
        )
    );

    await this.db.batch(statements as [typeof statements[0], ...typeof statements[0][]]);
  }
}
