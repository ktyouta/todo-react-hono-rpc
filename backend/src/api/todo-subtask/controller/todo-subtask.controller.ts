import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { createSubtask } from "./create-subtask.controller";
import { getSubtaskList } from "./get-subtask-list.controller";

// ルーティング（チェーンで型情報を保持）
const todoSubtask = new Hono<AppEnv>()
    .route("/", createSubtask)
    .route("/", getSubtaskList);

export { todoSubtask };
