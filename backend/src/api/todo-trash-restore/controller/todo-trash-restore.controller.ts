import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { restoreTodoTrash } from "./restore-todo-trash.controller";

const todoTrashRestore = new Hono<AppEnv>()
    .route("/", restoreTodoTrash);

export { todoTrashRestore };
