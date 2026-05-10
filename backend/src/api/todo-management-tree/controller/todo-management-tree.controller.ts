import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { getTodoManagementTree } from "./get-todo-management-tree.controller";

// ルーティング（チェーンで型情報を保持）
const todoManagementTree = new Hono<AppEnv>()
    .route("/", getTodoManagementTree);

export { todoManagementTree };
