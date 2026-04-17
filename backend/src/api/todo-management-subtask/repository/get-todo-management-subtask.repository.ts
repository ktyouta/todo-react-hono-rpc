import { and, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { TaskId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, frontUserMaster, priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import { IGetTodoManagementSubtaskRepository, ManagementSubtaskItem } from "./get-todo-management-subtask.repository.interface";

/**
 * サブタスク詳細取得リポジトリ実装
 */
export class GetTodoManagementSubtaskRepository implements IGetTodoManagementSubtaskRepository {
  private readonly parentTaskAlias = alias(taskTransaction, "parent_task");

  constructor(private readonly db: Database) { }

  /**
   * サブタスク取得
   */
  async find(parentTaskId: TaskId, subtaskId: TaskId): Promise<ManagementSubtaskItem | undefined> {
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
        isFavorite: taskTransaction.isFavorite,
        deleteFlg: taskTransaction.deleteFlg,
        parentId: taskTransaction.parentId,
        parentTitle: sql<string>`coalesce(${this.parentTaskAlias.title}, '')`,
        createdAt: taskTransaction.createdAt,
        updatedAt: taskTransaction.updatedAt,
        userName: sql<string>`coalesce(${frontUserMaster.name}, '')`,
      })
      .from(taskTransaction)
      .leftJoin(categoryMaster, eq(taskTransaction.categoryId, categoryMaster.id))
      .leftJoin(statusMaster, eq(taskTransaction.statusId, statusMaster.id))
      .leftJoin(priorityMaster, eq(taskTransaction.priorityId, priorityMaster.id))
      .leftJoin(this.parentTaskAlias, eq(taskTransaction.parentId, this.parentTaskAlias.id))
      .leftJoin(frontUserMaster, eq(taskTransaction.userId, frontUserMaster.id))
      .where(
        and(
          eq(taskTransaction.deleteFlg, false),
          eq(taskTransaction.parentId, parentTaskId.value),
          eq(taskTransaction.id, subtaskId.value),
        )
      )
      .get();
  }
}
