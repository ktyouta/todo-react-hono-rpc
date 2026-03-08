import { Hono } from "hono";
import type { AppEnv } from "../../../type";
import { getPriorityList } from "./get-priority-list.controller";

const priority = new Hono<AppEnv>()
    .route("/", getPriorityList);

export { priority };

