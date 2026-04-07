import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { bulkDeleteUserManagement } from "./bulk-delete-user-management.controller";

const userManagementBulkDelete = new Hono<AppEnv>()
    .route("/", bulkDeleteUserManagement);

export { userManagementBulkDelete };
