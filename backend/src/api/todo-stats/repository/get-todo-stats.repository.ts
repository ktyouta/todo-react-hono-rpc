import { and, asc, eq, sql } from "drizzle-orm";
import { FrontUserId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { taskTransaction } from "../../../infrastructure/db";
import type { IGetTodoStatsRepository, TodoStats } from "./get-todo-stats.repository.interface";

/**
 * タスク集計取得リポジトリ実装
 */
export class GetTodoStatsRepository implements IGetTodoStatsRepository {
  constructor(private readonly db: Database) { }

  /**
   * 集計取得
   */
  async find(userId: FrontUserId): Promise<TodoStats> {
    const [statsResult, overdueList, dueTodayList] = await Promise.all([
      this.db
        .select({
          overdue:        sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.dueDate} < date('now') AND ${taskTransaction.statusId} != 3 THEN 1 END)`,
          dueToday:       sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.dueDate} = date('now') AND ${taskTransaction.statusId} != 3 THEN 1 END)`,
          notStarted:     sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.statusId} = 1 THEN 1 END)`,
          inProgress:     sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.statusId} = 2 THEN 1 END)`,
          done:           sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.statusId} = 3 THEN 1 END)`,
          highPriority:   sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.priorityId} = 3 THEN 1 END)`,
          mediumPriority: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.priorityId} = 2 THEN 1 END)`,
          lowPriority:    sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.priorityId} = 1 THEN 1 END)`,
          favorites:      sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.isFavorite} = 1 THEN 1 END)`,
          trash:          sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 1 THEN 1 END)`,
          memos:          sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 2 THEN 1 END)`,
        })
        .from(taskTransaction)
        .where(eq(taskTransaction.userId, userId.value)),

      // 期限切れタスク上位5件（期日昇順）
      this.db
        .select({
          id:      taskTransaction.id,
          title:   taskTransaction.title,
          dueDate: taskTransaction.dueDate,
        })
        .from(taskTransaction)
        .where(and(
          eq(taskTransaction.userId, userId.value),
          eq(taskTransaction.deleteFlg, false),
          eq(taskTransaction.categoryId, 1),
          sql`${taskTransaction.dueDate} < date('now')`,
          sql`${taskTransaction.statusId} != 3`,
        ))
        .orderBy(asc(taskTransaction.dueDate))
        .limit(5),

      // 今日が期日のタスク上位5件
      this.db
        .select({
          id:      taskTransaction.id,
          title:   taskTransaction.title,
          dueDate: taskTransaction.dueDate,
        })
        .from(taskTransaction)
        .where(and(
          eq(taskTransaction.userId, userId.value),
          eq(taskTransaction.deleteFlg, false),
          eq(taskTransaction.categoryId, 1),
          sql`${taskTransaction.dueDate} = date('now')`,
          sql`${taskTransaction.statusId} != 3`,
        ))
        .orderBy(asc(taskTransaction.dueDate))
        .limit(5),
    ]);

    const [row] = statsResult;
    return {
      overdue:  row.overdue,
      dueToday: row.dueToday,
      overdueList: overdueList.map((t) => ({
        id:      t.id,
        title:   t.title,
        dueDate: t.dueDate ?? '',
      })),
      dueTodayList: dueTodayList.map((t) => ({
        id:      t.id,
        title:   t.title,
        dueDate: t.dueDate ?? '',
      })),
      byStatus: {
        notStarted: row.notStarted,
        inProgress: row.inProgress,
        done:       row.done,
      },
      byPriority: {
        high:   row.highPriority,
        medium: row.mediumPriority,
        low:    row.lowPriority,
      },
      favorites: row.favorites,
      trash:     row.trash,
      memos:     row.memos,
    };
  }
}
