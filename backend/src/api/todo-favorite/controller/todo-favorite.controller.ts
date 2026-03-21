import { Hono } from "hono";
import type { AppEnv } from "../../../type";
import { updateTodoFavorite } from "./update-todo-favorite.controller";

// ルーティング（チェーンで型情報を保持）
const todoFavorite = new Hono<AppEnv>()
    .route("/", updateTodoFavorite);

export { todoFavorite };
