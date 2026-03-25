import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { patchUserManagementRole } from "./patch-user-management-role.controller";

const userManagementRole = new Hono<AppEnv>()
    .route("/", patchUserManagementRole);

export { userManagementRole };
