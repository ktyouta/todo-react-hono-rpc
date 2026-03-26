import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { GetRoleListRepository } from "../repository/get-role-list.repository";

/**
 * ロール一覧取得（ドロップダウン用）
 * @route GET /api/v1/role-list
 */
const getRoleList = new Hono<AppEnv>().get(
    API_ENDPOINT.ROLE_LIST,
    authMiddleware,
    async (c) => {
        const db = c.get("db");
        const repository = new GetRoleListRepository(db);
        const list = await repository.findAll();
        return c.json({ message: "ロール一覧を取得しました。", data: list }, HTTP_STATUS.OK);
    }
);

export { getRoleList };
