export type AdminDashboardUserStats = {
  total: number;
  active: number;
  deleted: number;
  longInactive: number;
};

export type AdminDashboardUserByRole = {
  roleId: number;
  roleName: string;
  count: number;
};

export type AdminDashboardTaskStats = {
  total: number;
  trash: number;
  notStarted: number;
  inProgress: number;
  done: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  overdue: number;
};

export type AdminDashboardTaskByCategory = {
  categoryId: number;
  categoryName: string;
  count: number;
};

export type AdminDashboardDeadlineItem = {
  id: number;
  title: string;
  dueDate: string | null;
  userName: string | null;
};

export type AdminDashboardUserTaskStat = {
  userId: number;
  userName: string;
  taskCount: number;
  doneCount: number;
  overdueCount: number;
};

export type AdminDashboardStats = {
  userStats: AdminDashboardUserStats;
  userByRole: AdminDashboardUserByRole[];
  taskStats: AdminDashboardTaskStats;
  taskByCategory: AdminDashboardTaskByCategory[];
  overdueList: AdminDashboardDeadlineItem[];
  dueTodayList: AdminDashboardDeadlineItem[];
  dueSoonList: AdminDashboardDeadlineItem[];
  userTaskStats: AdminDashboardUserTaskStat[];
  roleCount: number;
  permissionCount: number;
};

/**
 * 管理者ダッシュボード集計取得リポジトリインターフェース
 */
export interface IGetAdminDashboardStatsRepository {
  /**
   * 集計取得
   */
  find(): Promise<AdminDashboardStats>;
}
