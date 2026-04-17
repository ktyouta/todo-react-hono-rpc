import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { deleteTodoManagementSubtask } from "./delete-todo-management-subtask.controller";
import { getTodoManagementSubtaskList } from "./get-todo-management-subtask-list.controller";
import { getTodoManagementSubtask } from "./get-todo-management-subtask.controller";
import { updateTodoManagementSubtask } from "./update-todo-management-subtask.controller";

const todoManagementSubtask = new Hono<AppEnv>()
    .route("/", getTodoManagementSubtaskList)
    .route("/", getTodoManagementSubtask)
    .route("/", updateTodoManagementSubtask)
    .route("/", deleteTodoManagementSubtask);

export { todoManagementSubtask };
