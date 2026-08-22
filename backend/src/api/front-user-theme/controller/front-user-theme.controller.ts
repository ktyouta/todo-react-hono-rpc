import { Hono } from "hono";
import type { AppEnv } from "../../../types";
import { updateFrontUserTheme } from "./update-front-user-theme.controller";

const frontUserTheme = new Hono<AppEnv>()
    .route("/", updateFrontUserTheme);

export { frontUserTheme };
