import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../type";
import { GetCategoryListRepository } from "../repository/get-category-list.repository";

/**
 * カテゴリ一覧取得
 * @route GET /api/v1/category
 */
const getCategoryList = new Hono<AppEnv>().get(
    API_ENDPOINT.CATEGORY,
    authMiddleware,
    async (c) => {
        const db = c.get("db");
        const repository = new GetCategoryListRepository(db);
        const list = await repository.findAll();
        return c.json({ message: "カテゴリ一覧を取得しました。", data: list }, HTTP_STATUS.OK);
    }
);

export { getCategoryList };
