import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { deleteTodoManagement } from "./delete-todo-management.controller";
import { getTodoManagementList } from "./get-todo-management-list.controller";
import { getTodoManagement } from "./get-todo-management.controller";
import { updateTodoManagement } from "./update-todo-management.controller";

const todoManagement = new Hono<AppEnv>()
    .route("/", getTodoManagementList)
    .route("/", getTodoManagement)
    .route("/", updateTodoManagement)
    .route("/", deleteTodoManagement);

export { todoManagement };

