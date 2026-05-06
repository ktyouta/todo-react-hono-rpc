import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { getTodoTree } from "./get-todo-tree.controller";

// ルーティング（チェーンで型情報を保持）
const todoTree = new Hono<AppEnv>()
    .route("/", getTodoTree);

export { todoTree };
