import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { getTodoManagementSubtaskList } from "./get-todo-management-subtask-list.controller";
import { getTodoManagementSubtask } from "./get-todo-management-subtask.controller";

const todoManagementSubtask = new Hono<AppEnv>()
    .route("/", getTodoManagementSubtaskList)
    .route("/", getTodoManagementSubtask);

export { todoManagementSubtask };
