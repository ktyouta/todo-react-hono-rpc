import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { patchUserManagementPassword } from "./patch-user-management-password.controller";

const userManagementPassword = new Hono<AppEnv>()
    .route("/", patchUserManagementPassword);

export { userManagementPassword };
