import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { FrontUserId } from "../../../domain";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { GetUserDeletedRepository } from "../repository/get-user-deleted.repository";
import { UserDeletedIdParamSchema } from "../schema/user-deleted-id-param.schema";
import { GetUserDeletedService } from "../service/get-user-deleted.service";

/**
 * 削除済みユーザー取得（管理者用）
 * @route GET /api/v1/user-deleted/:id
 */
const getUserDeleted = new Hono<AppEnv>().get(
    API_ENDPOINT.USER_DELETED_ID,
    requirePermission("deleted_user_management"),
    zValidator("param", UserDeletedIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const repository = new GetUserDeletedRepository(db);
        const service = new GetUserDeletedService(repository);
        const userId = FrontUserId.of(c.req.valid("param").id);

        const user = await service.find(userId);

        if (!user) {
            return c.json({ message: "Not Found", data: user }, HTTP_STATUS.NOT_FOUND);
        }

        return c.json({ message: "削除済みユーザーを取得しました。", data: user }, HTTP_STATUS.OK);
    }
);

export { getUserDeleted };
