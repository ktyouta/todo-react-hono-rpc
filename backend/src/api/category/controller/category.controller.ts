import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { getCategoryList } from "./get-category-list.controller";

const category = new Hono<AppEnv>()
    .route("/", getCategoryList);

export { category };
