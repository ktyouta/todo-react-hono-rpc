import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { getUserList } from "./get-user-list.controller";

const userList = new Hono<AppEnv>()
    .route("/", getUserList);

export { userList };
