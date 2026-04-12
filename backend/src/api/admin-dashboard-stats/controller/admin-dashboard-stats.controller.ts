import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { getAdminDashboardStats } from "./get-admin-dashboard-stats.controller";

const adminDashboardStats = new Hono<AppEnv>()
  .route("/", getAdminDashboardStats);

export { adminDashboardStats };
