import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { getTodoManagementExport } from "./get-todo-management-export.controller";

const todoManagementExport = new Hono<AppEnv>()
    .route("/", getTodoManagementExport);

export { todoManagementExport };
