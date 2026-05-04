import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { getTodoManagementSubtaskList } from "./get-todo-management-subtask-list.controller";

const todoManagementSubtask = new Hono<AppEnv>()
    .route("/", getTodoManagementSubtaskList);

export { todoManagementSubtask };
