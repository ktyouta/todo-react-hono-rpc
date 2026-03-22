import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { GetUserManagementListRepository } from "../repository/get-user-management-list.repository";
import { GetUserManagementListService } from "../service/get-user-management-list.service";

/**
 * ユーザー一覧取得
 * @route GET /api/v1/user-management
 */
const getUserManagementList = new Hono<AppEnv>().get(
    API_ENDPOINT.USER_MANAGEMENT,
    requirePermission("user_management"),
    async (c) => {
        const db = c.get("db");
        const repository = new GetUserManagementListRepository(db);
        const service = new GetUserManagementListService(repository);

        const list = await service.findAll();
        return c.json({ message: "ユーザー一覧を取得しました。", data: { list } }, HTTP_STATUS.OK);
    }
);

export { getUserManagementList };

