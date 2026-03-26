import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { getRoleList } from "./get-role-list.controller";

const roleList = new Hono<AppEnv>()
    .route("/", getRoleList);

export { roleList };
