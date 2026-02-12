import { UserIdParamSchema } from "../../../schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { API_ENDPOINT, FLG, HTTP_STATUS } from "../../../constant";
import {
    FrontUserBirthday,
    FrontUserId,
    FrontUserName,
    RefreshToken,
} from "../../../domain";
import { frontUserLoginMaster, frontUserMaster } from "../../../infrastructure/db";
import { authMiddleware, userOperationGuardMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../type";
import { formatZodErrors } from "../../../util";
import { UpdateFrontUserResponseDto } from "../dto";
import { UpdateFrontUserRepository } from "../repository";
import { UpdateFrontUserSchema } from "../schema";

/**
 * ユーザー更新
 * @route PATCH /api/v1/frontuser/:userId
 */
const updateFrontUser = new Hono<AppEnv>().patch(
    `${API_ENDPOINT.FRONT_USER_ID}`,
    userOperationGuardMiddleware,
    authMiddleware,
    zValidator("param", UserIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    zValidator("json", UpdateFrontUserSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "バリデーションエラー", data: formatZodErrors(result.error) }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const { userId } = c.req.valid("param");
        const body = c.req.valid("json");
        const db = c.get('db');
        const config = c.get('envConfig');

        const frontUserId = FrontUserId.of(userId);
        const userName = new FrontUserName(body.name);
        const userBirthday = new FrontUserBirthday(body.birthday);

        // ユーザー名重複チェック（自身を除く）
        const repository = new UpdateFrontUserRepository(db);
        if (await repository.checkUserNameExists(frontUserId, userName)) {
            return c.json({ message: "既にユーザーが存在しています。" }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }

        // ログイン情報更新 + ユーザー情報更新（batch で atomic 実行）
        const now = new Date().toISOString();
        const [, updateResult] = await db.batch([
            db.update(frontUserLoginMaster)
                .set({ name: userName.value, updatedAt: now })
                .where(
                    and(
                        eq(frontUserLoginMaster.id, frontUserId.value),
                        eq(frontUserLoginMaster.deleteFlg, FLG.OFF)
                    )
                ),
            db.update(frontUserMaster)
                .set({
                    name: userName.value,
                    birthday: userBirthday.value,
                    updatedAt: now,
                })
                .where(
                    and(
                        eq(frontUserMaster.id, frontUserId.value),
                        eq(frontUserMaster.deleteFlg, FLG.OFF)
                    )
                )
                .returning(),
        ]);
        const updated = updateResult[0];

        if (!updated) {
            return c.json({ message: "ユーザーが見つかりません。" }, HTTP_STATUS.NOT_FOUND);
        }

        // 新しいリフレッシュトークンを発行
        const refreshToken = await RefreshToken.create(frontUserId, config);

        const responseDto = new UpdateFrontUserResponseDto(
            updated.id,
            updated.name,
            updated.birthday
        );

        // リフレッシュトークンをCookieに設定
        setCookie(c, RefreshToken.COOKIE_KEY, refreshToken.value, RefreshToken.getCookieSetOption(config));

        return c.json({ message: "ユーザー情報の更新が完了しました。", data: responseDto.value }, HTTP_STATUS.OK);
    }
);

export { updateFrontUser };
