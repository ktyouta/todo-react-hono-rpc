import { and, eq, sql } from "drizzle-orm";
import { FrontUserId, TaskId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import type { SubtaskListItem } from "./get-subtask-list.repository.interface";
import type { IGetSubtaskRepository } from "./get-subtask.repository.interface";

/**
 * サブタスク詳細取得リポジトリ実装
 */
export class GetSubtaskRepository implements IGetSubtaskRepository {
  constructor(private readonly db: Database) { }

  /**
   * サブタスク取得
   */
  async find(userId: FrontUserId, parentTaskId: TaskId, subtaskId: TaskId): Promise<SubtaskListItem | undefined> {
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
        createdAt: taskTransaction.createdAt,
        updatedAt: taskTransaction.updatedAt,
      })
      .from(taskTransaction)
      .leftJoin(categoryMaster, eq(taskTransaction.categoryId, categoryMaster.id))
      .leftJoin(statusMaster, eq(taskTransaction.statusId, statusMaster.id))
      .leftJoin(priorityMaster, eq(taskTransaction.priorityId, priorityMaster.id))
      .where(
        and(
          eq(taskTransaction.deleteFlg, false),
          eq(taskTransaction.userId, userId.value),
          eq(taskTransaction.parentId, parentTaskId.value),
          eq(taskTransaction.id, subtaskId.value),
        )
      )
      .get();
  }
}
