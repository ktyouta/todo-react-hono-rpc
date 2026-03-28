import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { deleteUserDeleted } from "./delete-user-deleted.controller";
import { getUserDeleted } from "./get-user-deleted.controller";
import { getUserDeletedList } from "./get-user-deleted-list.controller";

const userDeleted = new Hono<AppEnv>()
    .route("/", getUserDeletedList)
    .route("/", getUserDeleted)
    .route("/", deleteUserDeleted);

export { userDeleted };
