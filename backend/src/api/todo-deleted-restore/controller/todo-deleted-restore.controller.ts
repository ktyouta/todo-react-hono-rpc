import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { restoreTodoDeleted } from "./restore-todo-deleted.controller";

const todoDeletedRestore = new Hono<AppEnv>()
    .route("/", restoreTodoDeleted);

export { todoDeletedRestore };
