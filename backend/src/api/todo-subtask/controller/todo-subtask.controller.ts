import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { createSubtask } from "./create-subtask.controller";
import { deleteSubtask } from "./delete-subtask.controller";
import { getSubtask } from "./get-subtask.controller";
import { getSubtaskList } from "./get-subtask-list.controller";
import { updateSubtask } from "./update-subtask.controller";

// ルーティング（チェーンで型情報を保持）
const todoSubtask = new Hono<AppEnv>()
    .route("/", createSubtask)
    .route("/", getSubtaskList)
    .route("/", getSubtask)
    .route("/", updateSubtask)
    .route("/", deleteSubtask);

export { todoSubtask };
