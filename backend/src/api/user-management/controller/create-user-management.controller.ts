import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS, SEQ_KEY } from "../../../constant";
import {
    FrontUserBirthday,
    FrontUserId,
    FrontUserName,
    FrontUserPassword,
    FrontUserSalt,
    Pepper,
    RoleId,
} from "../../../domain";
import { frontUserLoginMaster, frontUserMaster, seqMaster } from "../../../infrastructure/db";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { FrontUserEntity, FrontUserLoginEntity } from "../../front-user/entity";
import { CreateUserManagementRepository } from "../repository/create-user-management.repository";
import { CreateUserManagementSchema } from "../schema/create-user-management.schema";

/**
 * ユーザー作成（管理者用）
 * @route POST /api/v1/user-management
 */
const createUserManagement = new Hono<AppEnv>().post(
    API_ENDPOINT.USER_MANAGEMENT,
    requirePermission("user_create"),
    zValidator("json", CreateUserManagementSchema, (result, c) => {
        if (!result.success) {
            const data = formatZodErrors(result.error);
            const message = data.map((e) => e.message);
            return c.json({ message, data }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const body = c.req.valid("json");
        const db = c.get("db");
        const config = c.get("envConfig");
        const repository = new CreateUserManagementRepository(db);

        // ドメインオブジェクトを生成
        const userName = new FrontUserName(body.name);
        const userBirthday = new FrontUserBirthday(body.birthday);
        const roleId = RoleId.of(body.roleId);
        const salt = FrontUserSalt.generate();
        const pepper = new Pepper(config.pepper);
        const userPassword = await FrontUserPassword.hash(body.password, salt, pepper);

        // ユーザー名重複チェック
        const existingUsers = await repository.findByUserName(userName);
        if (existingUsers.length > 0) {
            return c.json({ message: "既にユーザーが存在しています。" }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }

        // ID採番: seq_master から次のIDを取得
        const nextId = await repository.getNextSeqId();

        if (nextId === null) {
            return c.json({ message: "シーケンスが初期化されていません。" }, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        const frontUserId = FrontUserId.of(nextId);

        // エンティティを生成
        const loginUserEntity = new FrontUserLoginEntity(frontUserId, userName, userPassword, salt);
        const userEntity = new FrontUserEntity(frontUserId, userName, userBirthday, roleId);

        // seq更新 + ログイン情報挿入 + ユーザー情報挿入（batch で atomic 実行）
        const now = new Date().toISOString();
        await db.batch([
            db.update(seqMaster)
                .set({ nextId: nextId + 1, updatedAt: now })
                .where(eq(seqMaster.key, SEQ_KEY.FRONT_USER_ID)),
            db.insert(frontUserLoginMaster).values({
                id: loginUserEntity.frontUserId,
                name: loginUserEntity.frontUserName,
                password: loginUserEntity.frontUserPassword,
                salt: loginUserEntity.salt,
                deleteFlg: false,
                createdAt: now,
                updatedAt: now,
            }),
            db.insert(frontUserMaster).values({
                id: userEntity.frontUserId,
                name: userEntity.frontUserName,
                birthday: userEntity.frontUserBirthday,
                roleId: userEntity.roleId,
                deleteFlg: false,
                createdAt: now,
                updatedAt: now,
            }),
        ]);

        return c.json(
            {
                message: "ユーザーを作成しました。",
                data: {
                    id: userEntity.frontUserId,
                    name: userEntity.frontUserName,
                    birthday: userEntity.frontUserBirthday,
                    roleId: userEntity.roleId,
                    createdAt: now,
                },
            },
            HTTP_STATUS.CREATED
        );
    }
);

export { createUserManagement };
