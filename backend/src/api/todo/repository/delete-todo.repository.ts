import { and, eq } from "drizzle-orm";
import { FrontUserId } from "../../../domain";
import { TaskId } from "../../../domain/task-id";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import { IDeleteTodoRepository, TodoItem } from "./delete-todo.repository.interface";

/**
 * タスク削除リポジトリ実装
 */
export class DeleteTodoRepository implements IDeleteTodoRepository {
  constructor(private readonly db: Database) { }

  /**
   * タスク取得
   */
  async find(userId: FrontUserId, taskId: TaskId): Promise<TodoItem | undefined> {
    return await this.db
      .select({
        isFavorite: taskTransaction.isFavorite,
      })
      .from(taskTransaction)
      .leftJoin(categoryMaster, eq(taskTransaction.categoryId, categoryMaster.id))
      .leftJoin(statusMaster, eq(taskTransaction.statusId, statusMaster.id))
      .leftJoin(priorityMaster, eq(taskTransaction.priorityId, priorityMaster.id))
      .where(
        and(
          eq(taskTransaction.deleteFlg, false),
          eq(taskTransaction.userId, userId.value),
          eq(taskTransaction.id, taskId.value),
        )
      )
      .get();
  }
}
