import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { createUserManagement } from "./create-user-management.controller";
import { deleteUserManagement } from "./delete-user-management.controller";
import { getUserManagement } from "./get-user-management.controller";
import { getUserManagementList } from "./get-user-management-list.controller";

const userManagement = new Hono<AppEnv>()
    .route("/", getUserManagementList)
    .route("/", getUserManagement)
    .route("/", createUserManagement)
    .route("/", deleteUserManagement);

export { userManagement };

