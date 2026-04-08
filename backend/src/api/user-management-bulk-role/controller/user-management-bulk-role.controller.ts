import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { bulkUpdateUserManagementRole } from "./bulk-update-user-management-role.controller";

const userManagementBulkRole = new Hono<AppEnv>()
    .route("/", bulkUpdateUserManagementRole);

export { userManagementBulkRole };
