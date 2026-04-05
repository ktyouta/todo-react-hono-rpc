import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { bulkUpdateTodoManagement } from "./bulk-update-todo-management.controller";

const todoManagementBulkUpdate = new Hono<AppEnv>()
  .route("/", bulkUpdateTodoManagement);

export { todoManagementBulkUpdate };
