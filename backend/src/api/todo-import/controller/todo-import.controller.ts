import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { importTodo } from "./import-todo.controller";

const todoImport = new Hono<AppEnv>().route("/", importTodo);

export { todoImport };
