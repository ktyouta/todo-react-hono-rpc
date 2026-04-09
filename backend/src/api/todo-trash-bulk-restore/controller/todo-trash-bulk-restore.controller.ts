import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { restoreTodoTrashBulk } from "./restore-todo-trash-bulk.controller";

const todoTrashBulkRestore = new Hono<AppEnv>()
    .route("/", restoreTodoTrashBulk);

export { todoTrashBulkRestore };
