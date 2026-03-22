import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { getUserManagementList } from "./get-user-management-list.controller";

const userManagement = new Hono<AppEnv>()
    .route("/", getUserManagementList);

export { userManagement };

