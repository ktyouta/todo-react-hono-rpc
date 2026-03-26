import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { GetUserListRepository } from "../repository/get-user-list.repository";

/**
 * ユーザー一覧取得（ドロップダウン用）
 * @route GET /api/v1/user-list
 */
const getUserList = new Hono<AppEnv>().get(
    API_ENDPOINT.USER_LIST,
    authMiddleware,
    async (c) => {
        const db = c.get("db");
        const repository = new GetUserListRepository(db);
        const list = await repository.findAll();
        return c.json({ message: "ユーザー一覧を取得しました。", data: list }, HTTP_STATUS.OK);
    }
);

export { getUserList };
