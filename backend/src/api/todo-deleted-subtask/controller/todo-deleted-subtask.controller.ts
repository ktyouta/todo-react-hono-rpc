import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { getTodoDeletedSubtaskList } from "./get-todo-deleted-subtask-list.controller";

const todoDeletedSubtask = new Hono<AppEnv>()
    .route("/", getTodoDeletedSubtaskList);

export { todoDeletedSubtask };
