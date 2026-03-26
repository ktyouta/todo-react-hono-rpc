import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetUserManagementListRepository } from "../repository/get-user-management-list.repository";
import { GetUserManagementListQuerySchema } from "../schema/get-user-management-list-query.schema";
import { GetUserManagementListService } from "../service/get-user-management-list.service";

/**
 * ユーザー一覧取得
 * @route GET /api/v1/user-management
 */
const getUserManagementList = new Hono<AppEnv>().get(
    API_ENDPOINT.USER_MANAGEMENT,
    requirePermission("user_management"),
    zValidator("query", GetUserManagementListQuerySchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "クエリが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const repository = new GetUserManagementListRepository(db);
        const service = new GetUserManagementListService(repository);
        const query = c.req.valid("query");

        const { list, total } = await service.findAll(query);
        const totalPages = Math.ceil(total / GetUserManagementListRepository.LIMIT);
        return c.json({ message: "ユーザー一覧を取得しました。", data: { list, total, totalPages } }, HTTP_STATUS.OK);
    }
);

export { getUserManagementList };
