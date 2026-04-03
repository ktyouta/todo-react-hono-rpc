import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { getPermissionList } from "./get-permission-list.controller";

const permissionList = new Hono<AppEnv>()
    .route("/", getPermissionList);

export { permissionList };
