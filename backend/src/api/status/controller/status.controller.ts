import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { getStatusList } from "./get-status-list.controller";

const status = new Hono<AppEnv>()
    .route("/", getStatusList);

export { status };
