import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { GetAdminDashboardStatsResponseDto } from "../dto/get-admin-dashboard-stats-response.dto";
import { GetAdminDashboardStatsRepository } from "../repository/get-admin-dashboard-stats.repository";
import { GetAdminDashboardStatsService } from "../service/get-admin-dashboard-stats.service";

/**
 * 管理者ダッシュボード集計取得
 * @route GET /api/v1/admin-dashboard/stats
 */
const getAdminDashboardStats = new Hono<AppEnv>().get(
  API_ENDPOINT.ADMIN_DASHBOARD_STATS,
  requirePermission("admin_dashboard"),
  async (c) => {
    const db = c.get("db");
    const repository = new GetAdminDashboardStatsRepository(db);
    const service = new GetAdminDashboardStatsService(repository);

    const stats = await service.find();
    const dto = new GetAdminDashboardStatsResponseDto(stats);

    return c.json({ message: "管理者ダッシュボード集計を取得しました。", data: dto.value }, HTTP_STATUS.OK);
  },
);

export { getAdminDashboardStats };
