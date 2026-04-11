import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { getTodoStats } from "./get-todo-stats.controller";

const todoStats = new Hono<AppEnv>()
    .route("/", getTodoStats);

export { todoStats };
