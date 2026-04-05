import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { bulkUpdateTodo } from "./bulk-update-todo.controller";

const todoBulkUpdate = new Hono<AppEnv>()
  .route("/", bulkUpdateTodo);

export { todoBulkUpdate };
