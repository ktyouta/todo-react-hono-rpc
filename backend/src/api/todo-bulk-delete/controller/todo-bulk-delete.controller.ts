import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { bulkDeleteTodo } from "./bulk-delete-todo.controller";

const todoBulkDelete = new Hono<AppEnv>()
  .route("/", bulkDeleteTodo);

export { todoBulkDelete };
