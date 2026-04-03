import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { GetPermissionListRepository } from "../repository/get-permission-list.repository";

/**
 * パーミッション一覧取得（ロール管理用）
 * @route GET /api/v1/permission-list
 */
const getPermissionList = new Hono<AppEnv>().get(
    API_ENDPOINT.PERMISSION_LIST,
    requirePermission("role_management"),
    async (c) => {
        const db = c.get("db");
        const repository = new GetPermissionListRepository(db);
        const list = await repository.findAll();
        return c.json({ message: "パーミッション一覧を取得しました。", data: list }, HTTP_STATUS.OK);
    }
);

export { getPermissionList };
