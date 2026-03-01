import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../type";
import { GetStatusListRepository } from "../repository/get-status-list.repository";

/**
 * ステータス一覧取得
 * @route GET /api/v1/status
 */
const getStatusList = new Hono<AppEnv>().get(
    API_ENDPOINT.STATUS,
    authMiddleware,
    async (c) => {
        const db = c.get("db");
        const repository = new GetStatusListRepository(db);
        const list = await repository.findAll();
        return c.json({ message: "ステータス一覧を取得しました。", data: list }, HTTP_STATUS.OK);
    }
);

export { getStatusList };
