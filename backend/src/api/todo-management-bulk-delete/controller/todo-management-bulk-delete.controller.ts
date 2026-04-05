import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { bulkDeleteTodoManagement } from "./bulk-delete-todo-management.controller";

const todoManagementBulkDelete = new Hono<AppEnv>()
  .route("/", bulkDeleteTodoManagement);

export { todoManagementBulkDelete };
