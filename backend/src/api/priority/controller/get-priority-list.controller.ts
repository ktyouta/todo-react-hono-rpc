import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { GetPriorityListRepository } from "../repository/get-priority-list.repository";

/**
 * 優先度一覧取得
 * @route GET /api/v1/priority
 */
const getPriorityList = new Hono<AppEnv>().get(
    API_ENDPOINT.PRIORITY,
    authMiddleware,
    async (c) => {
        const db = c.get("db");
        const repository = new GetPriorityListRepository(db);
        const list = await repository.findAll();
        return c.json({ message: "優先度一覧を取得しました。", data: list }, HTTP_STATUS.OK);
    }
);

export { getPriorityList };

