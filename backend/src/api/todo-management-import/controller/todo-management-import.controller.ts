import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { importTodoManagement } from "./import-todo-management.controller";

const todoManagementImport = new Hono<AppEnv>().route("/", importTodoManagement);

export { todoManagementImport };
