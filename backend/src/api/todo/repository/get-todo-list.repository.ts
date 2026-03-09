import { and, eq, sql } from "drizzle-orm";
import { FLG } from "../../../constant";
import { FrontUserId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import type { IGetTodoListRepository, TodoListItem } from "./get-todo-list.repository.interface";

/**
 * タスク一覧取得リポジトリ実装
 */
export class GetTodoListRepository implements IGetTodoListRepository {
  constructor(private readonly db: Database) { }

  /**
   * 全件取得
   */
  async findAll(userId: FrontUserId): Promise<TodoListItem[]> {
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
        deleteFlg: taskTransaction.deleteFlg,
        createdAt: taskTransaction.createdAt,
        updatedAt: taskTransaction.updatedAt,
      })
      .from(taskTransaction)
      .leftJoin(categoryMaster, eq(taskTransaction.categoryId, categoryMaster.id))
      .leftJoin(statusMaster, eq(taskTransaction.statusId, statusMaster.id))
      .leftJoin(priorityMaster, eq(taskTransaction.priorityId, priorityMaster.id))
      .where(
        and(
          eq(taskTransaction.deleteFlg, FLG.OFF),
          eq(taskTransaction.userId, userId.value)
        )
      );
  }
}
