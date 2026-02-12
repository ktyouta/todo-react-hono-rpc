import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { API_ENDPOINT, FLG, HTTP_STATUS } from "../../../constant";
import {
    AccessToken,
    FrontUserBirthday,
    FrontUserId,
    FrontUserName,
    FrontUserPassword,
    FrontUserSalt,
    Pepper,
    RefreshToken,
} from "../../../domain";
import { frontUserLoginMaster, frontUserMaster, seqMaster } from "../../../infrastructure/db";
import { userOperationGuardMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../type";
import { formatZodErrors } from "../../../util";
import { CreateFrontUserResponseDto } from "../dto";
import { FrontUserEntity, FrontUserLoginEntity } from "../entity";
import { CreateFrontUserRepository } from "../repository";
import { CreateFrontUserSchema } from "../schema";

const SEQ_KEY = "front_user_id";

/**
 * ユーザー作成
 * @route POST /api/v1/frontuser
 */
const createFrontUser = new Hono<AppEnv>().post(
    API_ENDPOINT.FRONT_USER,
    userOperationGuardMiddleware,
    zValidator("json", CreateFrontUserSchema, (result, c) => {
        if (!result.success) {
            const data = formatZodErrors(result.error);
            const message = data.map((e) => e.message);
            return c.json({ message, data }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const body = c.req.valid("json");
        const db = c.get('db');
        const config = c.get('envConfig');
        const repository = new CreateFrontUserRepository(db);

        // ドメインオブジェクトを生成
        const userName = new FrontUserName(body.name);
        const userBirthday = new FrontUserBirthday(body.birthday);
        const salt = FrontUserSalt.generate();
        const pepper = new Pepper(config.pepper);
        const userPassword = await FrontUserPassword.hash(
            body.password,
            salt,
            pepper
        );

        // ユーザー名重複チェック
        const existingUsers = await repository.findByUserName(userName);
        if (existingUsers.length > 0) {
            return c.json({ message: "既にユーザーが存在しています。" }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }

        // ID採番: seq_master から次のIDを取得
        const seqResult = await db
            .select()
            .from(seqMaster)
            .where(eq(seqMaster.key, SEQ_KEY));

        if (seqResult.length === 0) {
            return c.json({ message: "シーケンスが初期化されていません。" }, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        const nextId = seqResult[0].nextId;
        const frontUserId = FrontUserId.of(nextId);

        // エンティティを生成
        const loginUserEntity = new FrontUserLoginEntity(
            frontUserId,
            userName,
            userPassword,
            salt
        );
        const userEntity = new FrontUserEntity(frontUserId, userName, userBirthday);

        // seq更新 + ログイン情報挿入 + ユーザー情報挿入（batch で atomic 実行）
        const now = new Date().toISOString();
        await db.batch([
            db.update(seqMaster)
                .set({ nextId: nextId + 1, updatedAt: now })
                .where(eq(seqMaster.key, SEQ_KEY)),
            db.insert(frontUserLoginMaster).values({
                id: loginUserEntity.frontUserId,
                name: loginUserEntity.frontUserName,
                password: loginUserEntity.frontUserPassword,
                salt: loginUserEntity.salt,
                deleteFlg: FLG.OFF,
                createdAt: now,
                updatedAt: now,
            }),
            db.insert(frontUserMaster).values({
                id: userEntity.frontUserId,
                name: userEntity.frontUserName,
                birthday: userEntity.frontUserBirthday,
                deleteFlg: FLG.OFF,
                createdAt: now,
                updatedAt: now,
            }),
        ]);

        // トークンを発行
        const accessToken = await AccessToken.create(frontUserId, config);
        const refreshToken = await RefreshToken.create(frontUserId, config);

        const responseDto = new CreateFrontUserResponseDto(
            userEntity,
            accessToken.token
        );

        // リフレッシュトークンをCookieに設定
        setCookie(c, RefreshToken.COOKIE_KEY, refreshToken.value, RefreshToken.getCookieSetOption(config));

        return c.json({ message: "ユーザー情報の登録が完了しました。", data: responseDto.value }, HTTP_STATUS.CREATED);
    }
);

export { createFrontUser };

