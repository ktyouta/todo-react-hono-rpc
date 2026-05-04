import { and, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { FrontUserId } from "../../../domain";
import { TaskId } from "../../../domain/task-id";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
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
    const parentTask = alias(taskTransaction, 'parent_task');
    return await this.db
      .select({
        id: taskTransaction.id,
        title: taskTransaction.title,
        content: taskTransaction.content,
        categoryId: taskTransaction.categoryId,
        categoryName: sql<string>`coalesce(${categoryMaster.name}, '')`,
        statusId: taskTransaction.statusId,
        statusName: sql<string>`coalesce(${statusMaster.name}, 'なし')`,
        priorityId: taskTransaction.priorityId,
        priorityName: sql<string>`coalesce(${priorityMaster.name}, 'なし')`,
        dueDate: taskTransaction.dueDate,
        userId: taskTransaction.userId,
        isFavorite: taskTransaction.isFavorite,
        deleteFlg: taskTransaction.deleteFlg,
        createdAt: taskTransaction.createdAt,
        updatedAt: taskTransaction.updatedAt,
        parentId: taskTransaction.parentId,
        parentTitle: parentTask.title,
      })
      .from(taskTransaction)
      .leftJoin(categoryMaster, eq(taskTransaction.categoryId, categoryMaster.id))
      .leftJoin(statusMaster, eq(taskTransaction.statusId, statusMaster.id))
      .leftJoin(priorityMaster, eq(taskTransaction.priorityId, priorityMaster.id))
      .leftJoin(parentTask, eq(taskTransaction.parentId, parentTask.id))
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
