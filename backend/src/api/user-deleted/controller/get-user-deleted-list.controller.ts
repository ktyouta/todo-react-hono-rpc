import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetUserDeletedListRepository } from "../repository/get-user-deleted-list.repository";
import { GetUserDeletedListQuerySchema } from "../schema/get-user-deleted-list-query.schema";
import { GetUserDeletedListService } from "../service/get-user-deleted-list.service";

/**
 * 削除済みユーザー一覧取得（管理者用）
 * @route GET /api/v1/user-deleted
 */
const getUserDeletedList = new Hono<AppEnv>().get(
    API_ENDPOINT.USER_DELETED,
    requirePermission("deleted_user_management"),
    zValidator("query", GetUserDeletedListQuerySchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "クエリが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const repository = new GetUserDeletedListRepository(db);
        const service = new GetUserDeletedListService(repository);
        const query = c.req.valid("query");

        const { list, total } = await service.findAll(query);
        const totalPages = Math.ceil(total / GetUserDeletedListRepository.LIMIT);
        return c.json({ message: "削除済みユーザー一覧を取得しました。", data: { list, total, totalPages } }, HTTP_STATUS.OK);
    }
);

export { getUserDeletedList };
