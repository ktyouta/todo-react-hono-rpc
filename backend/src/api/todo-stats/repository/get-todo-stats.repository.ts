import { eq, sql } from "drizzle-orm";
import { FrontUserId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { taskTransaction } from "../../../infrastructure/db";
import type { IGetTodoStatsRepository, TodoStats } from "./get-todo-stats.repository.interface";

/**
 * タスク集計取得リポジトリ実装
 */
export class GetTodoStatsRepository implements IGetTodoStatsRepository {
  constructor(private readonly db: Database) {}

  /**
   * 集計取得
   */
  async find(userId: FrontUserId): Promise<TodoStats> {
    const [row] = await this.db
      .select({
        overdue:      sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.dueDate} < date('now') AND ${taskTransaction.statusId} != 3 THEN 1 END)`,
        dueToday:     sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.dueDate} = date('now') THEN 1 END)`,
        notStarted:   sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.statusId} = 1 THEN 1 END)`,
        inProgress:   sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.statusId} = 2 THEN 1 END)`,
        done:         sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.statusId} = 3 THEN 1 END)`,
        highPriority: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.priorityId} = 3 THEN 1 END)`,
        favorites:    sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.isFavorite} = 1 THEN 1 END)`,
        trash:        sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 1 THEN 1 END)`,
        memos:        sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 2 THEN 1 END)`,
      })
      .from(taskTransaction)
      .where(eq(taskTransaction.userId, userId.value));

    return {
      overdue:      row.overdue,
      dueToday:     row.dueToday,
      byStatus: {
        notStarted: row.notStarted,
        inProgress: row.inProgress,
        done:       row.done,
      },
      highPriority: row.highPriority,
      favorites:    row.favorites,
      trash:        row.trash,
      memos:        row.memos,
    };
  }
}
