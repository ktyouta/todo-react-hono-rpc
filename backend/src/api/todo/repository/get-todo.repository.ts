import { and, eq, sql } from "drizzle-orm";
import { FLG } from "../../../constant";
import { FrontUserId } from "../../../domain";
import { TaskId } from "../../../domain/task-id";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import { IGetTodoRepository, TodoItem } from "./get-todo.repository.interface";

/**
 * タスク一覧取得リポジトリ実装
 */
export class GetTodoRepository implements IGetTodoRepository {
  constructor(private readonly db: Database) { }

  /**
   * タスク取得
   */
  async find(userId: FrontUserId, taskId: TaskId): Promise<TodoItem | undefined> {
    return await this.db
      .select({
        id: taskTransaction.id,
        title: taskTransaction.title,
        content: taskTransaction.content,
        categoryId: taskTransaction.categoryId,
        categoryName: sql<string>`coalesce(${categoryMaster.name}, '')`,
        statusId: taskTransaction.statusId,
        statusName: sql<string>`coalesce(${statusMaster.name}, 'なし')`,
        userId: taskTransaction.userId,
        deleteFlg: taskTransaction.deleteFlg,
        createdAt: taskTransaction.createdAt,
        updatedAt: taskTransaction.updatedAt,
      })
      .from(taskTransaction)
      .leftJoin(categoryMaster, eq(taskTransaction.categoryId, categoryMaster.id))
      .leftJoin(statusMaster, eq(taskTransaction.statusId, statusMaster.id))
      .where(
        and(
          eq(taskTransaction.deleteFlg, FLG.OFF),
          eq(taskTransaction.userId, userId.value),
          eq(taskTransaction.id, taskId.value),
        )
      )
      .get();
  }
}
