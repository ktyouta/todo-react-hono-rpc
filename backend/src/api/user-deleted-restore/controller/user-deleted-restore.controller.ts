import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { restoreUserDeleted } from "./restore-user-deleted.controller";

const userDeletedRestore = new Hono<AppEnv>()
    .route("/", restoreUserDeleted);

export { userDeletedRestore };
