import { and, eq, inArray } from "drizzle-orm";
import { FrontUserId } from "../../../domain";
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
   */
  async bulkUpdate(userId: FrontUserId, query: BulkUpdateTodoSchemaType, now: string): Promise<void> {
    await this.db
      .update(taskTransaction)
      .set({
        ...(query.statusId !== undefined && { statusId: query.statusId }),
        ...(query.categoryId !== undefined && { categoryId: query.categoryId }),
        ...(query.priorityId !== undefined && { priorityId: query.priorityId }),
        updatedAt: now,
      })
      .where(
        and(
          eq(taskTransaction.userId, userId.value),
          eq(taskTransaction.deleteFlg, false),
          inArray(taskTransaction.id, query.ids)
        )
      );
  }
}
