import type { AdminDashboardStats } from "../repository/get-admin-dashboard-stats.repository.interface";

/**
 * 管理者ダッシュボード集計レスポンスの型
 */
export type GetAdminDashboardStatsResponseType = {
  userStats: {
    total: number;
    active: number;
    deleted: number;
    longInactive: number;
  };
  userByRole: { roleId: number; roleName: string; count: number }[];
  taskStats: {
    total: number;
    trash: number;
    byStatus: { notStarted: number; inProgress: number; done: number };
    byPriority: { high: number; medium: number; low: number };
    overdue: number;
    tasks: number;
    subTasks: number;
    memos: number;
  };
  taskDeadlines: {
    overdueList: { id: number; title: string; dueDate: string; userName: string }[];
    dueTodayList: { id: number; title: string; dueDate: string; userName: string }[];
    dueSoonList: { id: number; title: string; dueDate: string; userName: string }[];
  };
  userTaskStats: {
    userId: number;
    userName: string;
    taskCount: number;
    doneCount: number;
    overdueCount: number;
  }[];
  systemStats: {
    roleCount: number;
    permissionCount: number;
  };
};

/**
 * 管理者ダッシュボード集計レスポンスDTO
 */
export class GetAdminDashboardStatsResponseDto {
  private readonly _value: GetAdminDashboardStatsResponseType;

  constructor(stats: AdminDashboardStats) {
    const mapDeadlineItem = (item: { id: number; title: string; dueDate: string | null; userName: string | null }) => ({
      id: item.id,
      title: item.title,
      dueDate: item.dueDate ?? "",
      userName: item.userName ?? "",
    });

    this._value = {
      userStats: {
        total: stats.userStats.total,
        active: stats.userStats.active,
        deleted: stats.userStats.deleted,
        longInactive: stats.userStats.longInactive,
      },
      userByRole: stats.userByRole.map((r) => ({
        roleId: r.roleId,
        roleName: r.roleName,
        count: r.count,
      })),
      taskStats: {
        total: stats.taskStats.total,
        trash: stats.taskStats.trash,
        byStatus: {
          notStarted: stats.taskStats.notStarted,
          inProgress: stats.taskStats.inProgress,
          done: stats.taskStats.done,
        },
        byPriority: {
          high: stats.taskStats.highPriority,
          medium: stats.taskStats.mediumPriority,
          low: stats.taskStats.lowPriority,
        },
        overdue: stats.taskStats.overdue,
        tasks: stats.taskStats.tasks,
        subTasks: stats.taskStats.subTasks,
        memos: stats.taskStats.memos,
      },
      taskDeadlines: {
        overdueList: stats.overdueList.map(mapDeadlineItem),
        dueTodayList: stats.dueTodayList.map(mapDeadlineItem),
        dueSoonList: stats.dueSoonList.map(mapDeadlineItem),
      },
      userTaskStats: stats.userTaskStats.map((u) => ({
        userId: u.userId,
        userName: u.userName,
        taskCount: u.taskCount,
        doneCount: u.doneCount,
        overdueCount: u.overdueCount,
      })),
      systemStats: {
        roleCount: stats.roleCount,
        permissionCount: stats.permissionCount,
      },
    };
  }

  get value(): GetAdminDashboardStatsResponseType {
    return this._value;
  }
}
