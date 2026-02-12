import { UserIdParamSchema } from "../../../schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { API_ENDPOINT, FLG, HTTP_STATUS } from "../../../constant";
import { FrontUserId, RefreshToken } from "../../../domain";
import { frontUserLoginMaster, frontUserMaster } from "../../../infrastructure/db";
import { authMiddleware, userOperationGuardMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../type";
import { formatZodErrors } from "../../../util";

/**
 * ユーザー削除
 * @route DELETE /api/v1/frontuser/:userId
 */
const deleteFrontUser = new Hono<AppEnv>().delete(
    `${API_ENDPOINT.FRONT_USER_ID}`,
    userOperationGuardMiddleware,
    authMiddleware,
    zValidator("param", UserIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const { userId } = c.req.valid("param");
        const db = c.get('db');
        const config = c.get('envConfig');
        const frontUserId = FrontUserId.of(userId);

        // ログイン情報削除 + ユーザー情報削除（batch で atomic 実行）
        const now = new Date().toISOString();
        const [, deleteResult] = await db.batch([
            db.update(frontUserLoginMaster)
                .set({ deleteFlg: FLG.ON, updatedAt: now })
                .where(
                    and(
                        eq(frontUserLoginMaster.id, frontUserId.value),
                        eq(frontUserLoginMaster.deleteFlg, FLG.OFF)
                    )
                ),
            db.update(frontUserMaster)
                .set({ deleteFlg: FLG.ON, updatedAt: now })
                .where(
                    and(
                        eq(frontUserMaster.id, frontUserId.value),
                        eq(frontUserMaster.deleteFlg, FLG.OFF)
                    )
                )
                .returning(),
        ]);
        const deleted = deleteResult.length > 0;

        if (!deleted) {
            return c.json({ message: "ユーザーが見つかりません。" }, HTTP_STATUS.NOT_FOUND);
        }

        // リフレッシュトークンCookieをクリア
        setCookie(c, RefreshToken.COOKIE_KEY, "", RefreshToken.getCookieClearOption(config));

        return c.body(null, HTTP_STATUS.NO_CONTENT);
    }
);

export { deleteFrontUser };
