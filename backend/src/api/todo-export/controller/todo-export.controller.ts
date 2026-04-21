import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { getTodoExport } from "./get-todo-export.controller";

const todoExport = new Hono<AppEnv>()
    .route("/", getTodoExport);

export { todoExport };
