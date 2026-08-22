import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { UpdateFrontUserThemeRepository } from "../repository";
import { UpdateFrontUserThemeSchema } from "../schema";
import { UpdateFrontUserThemeService } from "../service";

/**
 * ダークモード設定更新
 * @route PATCH /api/v1/frontuser-theme
 */
const updateFrontUserTheme = new Hono<AppEnv>().patch(
    API_ENDPOINT.FRONT_USER_THEME,
    authMiddleware,
    zValidator("json", UpdateFrontUserThemeSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "バリデーションエラー", data: formatZodErrors(result.error) }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const user = c.get("user");

        if (!user) {
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }

        const { darkMode } = c.req.valid("json");
        const repository = new UpdateFrontUserThemeRepository(db);
        const service = new UpdateFrontUserThemeService(repository);

        // ダークモード設定を更新
        const updated = await service.updateDarkMode(user.userId, darkMode);

        if (!updated) {
            return c.json({ message: "ユーザーが見つかりません。" }, HTTP_STATUS.NOT_FOUND);
        }

        return c.json({ message: "ダークモード設定を更新しました。" }, HTTP_STATUS.OK);
    }
);

export { updateFrontUserTheme };
