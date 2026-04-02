import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { createRoleManagement } from "./create-role-management.controller";
import { deleteRoleManagement } from "./delete-role-management.controller";
import { getRoleManagementList } from "./get-role-management-list.controller";
import { getRoleManagement } from "./get-role-management.controller";
import { updateRoleManagement } from "./update-role-management.controller";

const roleManagement = new Hono<AppEnv>()
    .route("/", getRoleManagementList)
    .route("/", getRoleManagement)
    .route("/", createRoleManagement)
    .route("/", updateRoleManagement)
    .route("/", deleteRoleManagement);

export { roleManagement };
