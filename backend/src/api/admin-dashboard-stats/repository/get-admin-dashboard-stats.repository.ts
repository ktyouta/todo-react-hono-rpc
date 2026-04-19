import { and, asc, desc, eq, sql } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import {
  frontUserMaster,
  permissionMaster,
  roleMaster,
  taskTransaction
} from "../../../infrastructure/db";
import type {
  AdminDashboardStats,
  IGetAdminDashboardStatsRepository,
} from "./get-admin-dashboard-stats.repository.interface";

/** 長期未ログインの閾値（日数） */
const LONG_INACTIVE_DAYS = 30;

/**
 * 管理者ダッシュボード集計取得リポジトリ実装
 */
export class GetAdminDashboardStatsRepository implements IGetAdminDashboardStatsRepository {
  constructor(private readonly db: Database) { }

  /**
   * 集計取得
   */
  async find(): Promise<AdminDashboardStats> {
    const [
      userStatsResult,
      userByRoleResult,
      taskStatsResult,
      overdueListResult,
      dueTodayListResult,
      dueSoonListResult,
      userTaskStatsResult,
      roleCountResult,
      permissionCountResult,
    ] = await Promise.all([
      // ユーザー集計
      this.db
        .select({
          total: sql<number>`COUNT(*)`,
          active: sql<number>`COUNT(CASE WHEN ${frontUserMaster.deleteFlg} = 0 THEN 1 END)`,
          deleted: sql<number>`COUNT(CASE WHEN ${frontUserMaster.deleteFlg} = 1 THEN 1 END)`,
          longInactive: sql<number>`COUNT(CASE WHEN ${frontUserMaster.deleteFlg} = 0 AND (${frontUserMaster.lastLoginDate} < date('now', ${sql.raw(`'-${LONG_INACTIVE_DAYS} days'`)}) OR ${frontUserMaster.lastLoginDate} IS NULL) THEN 1 END)`,
        })
        .from(frontUserMaster),

      // ロール別ユーザー数
      this.db
        .select({
          roleId: roleMaster.id,
          roleName: roleMaster.name,
          count: sql<number>`COUNT(${frontUserMaster.id})`,
        })
        .from(roleMaster)
        .leftJoin(
          frontUserMaster,
          and(
            eq(frontUserMaster.roleId, roleMaster.id),
            eq(frontUserMaster.deleteFlg, false),
          ),
        )
        .groupBy(roleMaster.id, roleMaster.name),

      // タスク集計（全ユーザー合計）
      this.db
        .select({
          total: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 THEN 1 END)`,
          trash: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 1 THEN 1 END)`,
          notStarted: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.statusId} = 1 THEN 1 END)`,
          inProgress: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.statusId} = 2 THEN 1 END)`,
          done: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.statusId} = 3 THEN 1 END)`,
          highPriority: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.priorityId} = 3 THEN 1 END)`,
          mediumPriority: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.priorityId} = 2 THEN 1 END)`,
          lowPriority: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.priorityId} = 1 THEN 1 END)`,
          overdue: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.dueDate} < date('now') AND ${taskTransaction.statusId} != 3 THEN 1 END)`,
          tasks: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.parentId} IS NULL THEN 1 END)`,
          subTasks: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.parentId} IS NOT NULL THEN 1 END)`,
          memos: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 2 THEN 1 END)`,
        })
        .from(taskTransaction),

      // 期限切れタスク上位5件（期日昇順）
      this.db
        .select({
          id: taskTransaction.id,
          title: taskTransaction.title,
          dueDate: taskTransaction.dueDate,
          userName: frontUserMaster.name,
        })
        .from(taskTransaction)
        .leftJoin(frontUserMaster, eq(taskTransaction.userId, frontUserMaster.id))
        .where(
          and(
            eq(taskTransaction.deleteFlg, false),
            eq(taskTransaction.categoryId, 1),
            sql`${taskTransaction.dueDate} < date('now')`,
            sql`${taskTransaction.statusId} != 3`,
          ),
        )
        .orderBy(asc(taskTransaction.dueDate))
        .limit(5),

      // 今日が期日のタスク上位5件
      this.db
        .select({
          id: taskTransaction.id,
          title: taskTransaction.title,
          dueDate: taskTransaction.dueDate,
          userName: frontUserMaster.name,
        })
        .from(taskTransaction)
        .leftJoin(frontUserMaster, eq(taskTransaction.userId, frontUserMaster.id))
        .where(
          and(
            eq(taskTransaction.deleteFlg, false),
            eq(taskTransaction.categoryId, 1),
            sql`${taskTransaction.dueDate} = date('now')`,
            sql`${taskTransaction.statusId} != 3`,
          ),
        )
        .orderBy(asc(taskTransaction.id))
        .limit(5),

      // 今週が期日のタスク上位5件（明日〜7日以内）
      this.db
        .select({
          id: taskTransaction.id,
          title: taskTransaction.title,
          dueDate: taskTransaction.dueDate,
          userName: frontUserMaster.name,
        })
        .from(taskTransaction)
        .leftJoin(frontUserMaster, eq(taskTransaction.userId, frontUserMaster.id))
        .where(
          and(
            eq(taskTransaction.deleteFlg, false),
            eq(taskTransaction.categoryId, 1),
            sql`${taskTransaction.dueDate} > date('now')`,
            sql`${taskTransaction.dueDate} <= date('now', '+7 days')`,
            sql`${taskTransaction.statusId} != 3`,
          ),
        )
        .orderBy(asc(taskTransaction.dueDate))
        .limit(5),

      // ユーザー別タスク状況（タスク数降順）
      this.db
        .select({
          userId: frontUserMaster.id,
          userName: frontUserMaster.name,
          taskCount: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 THEN 1 END)`,
          doneCount: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.statusId} = 3 THEN 1 END)`,
          overdueCount: sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 AND ${taskTransaction.categoryId} = 1 AND ${taskTransaction.dueDate} < date('now') AND ${taskTransaction.statusId} != 3 THEN 1 END)`,
        })
        .from(frontUserMaster)
        .leftJoin(taskTransaction, eq(taskTransaction.userId, frontUserMaster.id))
        .where(eq(frontUserMaster.deleteFlg, false))
        .groupBy(frontUserMaster.id, frontUserMaster.name)
        .orderBy(desc(sql<number>`COUNT(CASE WHEN ${taskTransaction.deleteFlg} = 0 THEN 1 END)`)),

      // ロール数
      this.db
        .select({ count: sql<number>`COUNT(*)` })
        .from(roleMaster),

      // パーミッション数（permission_master の総件数）
      this.db
        .select({ count: sql<number>`COUNT(*)` })
        .from(permissionMaster),
    ]);

    const [userStats] = userStatsResult;
    const [taskStats] = taskStatsResult;
    const [roleCount] = roleCountResult;
    const [permissionCount] = permissionCountResult;

    return {
      userStats,
      userByRole: userByRoleResult,
      taskStats,
      overdueList: overdueListResult,
      dueTodayList: dueTodayListResult,
      dueSoonList: dueSoonListResult,
      userTaskStats: userTaskStatsResult,
      roleCount: roleCount.count,
      permissionCount: permissionCount.count,
    };
  }
}
