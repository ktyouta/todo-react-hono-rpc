import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { deleteTodoDeleted } from "./delete-todo-deleted.controller";
import { getTodoDeleted } from "./get-todo-deleted.controller";
import { getTodoDeletedList } from "./get-todo-deleted-list.controller";

const todoDeleted = new Hono<AppEnv>()
    .route("/", getTodoDeletedList)
    .route("/", getTodoDeleted)
    .route("/", deleteTodoDeleted);

export { todoDeleted };
