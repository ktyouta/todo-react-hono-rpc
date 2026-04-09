import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { deleteTodoTrash } from "./delete-todo-trash.controller";
import { getTodoTrash } from "./get-todo-trash.controller";
import { getTodoTrashList } from "./get-todo-trash-list.controller";

const todoTrash = new Hono<AppEnv>()
    .route("/", getTodoTrashList)
    .route("/", getTodoTrash)
    .route("/", deleteTodoTrash);

export { todoTrash };
