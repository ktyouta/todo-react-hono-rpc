import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { getTodoTrashSubtaskList } from "./get-todo-trash-subtask-list.controller";

const todoTrashSubtask = new Hono<AppEnv>()
    .route("/", getTodoTrashSubtaskList);

export { todoTrashSubtask };
