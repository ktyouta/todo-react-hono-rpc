import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { restoreTodoDeletedBulk } from "./restore-todo-deleted-bulk.controller";

const todoDeletedBulkRestore = new Hono<AppEnv>()
    .route("/", restoreTodoDeletedBulk);

export { todoDeletedBulkRestore };
