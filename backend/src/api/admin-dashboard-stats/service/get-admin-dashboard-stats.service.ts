import type { AdminDashboardStats, IGetAdminDashboardStatsRepository } from "../repository/get-admin-dashboard-stats.repository.interface";

/**
 * 管理者ダッシュボード集計取得サービス
 */
export class GetAdminDashboardStatsService {
  constructor(private readonly repository: IGetAdminDashboardStatsRepository) {}

  /**
   * 集計取得
   */
  async find(): Promise<AdminDashboardStats> {
    return await this.repository.find();
  }
}
