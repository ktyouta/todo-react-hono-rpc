import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { deleteUserManagement } from "./delete-user-management.controller";
import { getUserManagement } from "./get-user-management.controller";
import { getUserManagementList } from "./get-user-management-list.controller";
import { patchUserManagementPassword } from "./patch-user-management-password.controller";
import { patchUserManagementRole } from "./patch-user-management-role.controller";

const userManagement = new Hono<AppEnv>()
    .route("/", getUserManagementList)
    .route("/", getUserManagement)
    .route("/", patchUserManagementRole)
    .route("/", patchUserManagementPassword)
    .route("/", deleteUserManagement);

export { userManagement };

