import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { restoreUserDeletedBulk } from "./restore-user-deleted-bulk.controller";

const userDeletedBulkRestore = new Hono<AppEnv>()
    .route("/", restoreUserDeletedBulk);

export { userDeletedBulkRestore };
