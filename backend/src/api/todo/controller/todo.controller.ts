import { Hono } from "hono";
import type { AppEnv } from "../../../type";
import { createTodo } from "./create-todo.controller";
import { getTodoList } from "./get-todo-list.controller";
import { getTodo } from "./get-todo.controller";
import { updateTodo } from "./update-todo.controller";

// ルーティング（チェーンで型情報を保持）
const todo = new Hono<AppEnv>()
    .route("/", createTodo)
    .route("/", getTodoList)
    .route("/", getTodo)
    .route("/", updateTodo)

export { todo };

