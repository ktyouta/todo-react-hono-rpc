import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { FrontUserId } from "../../../domain";
import { frontUserLoginMaster, frontUserMaster } from "../../../infrastructure/db";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { UserManagementIdParamSchema } from "../schema/user-management-id-param.schema";

/**
 * ユーザー削除（論理削除・管理者用）
 * @route DELETE /api/v1/user-management/:id
 */
const deleteUserManagement = new Hono<AppEnv>().delete(
    API_ENDPOINT.USER_MANAGEMENT_ID,
    requirePermission("user_management"),
    zValidator("param", UserManagementIdParamSchema, (result, c) => {
        if (!result.success) {
            return c.json({ message: "パラメータが不正です。", data: formatZodErrors(result.error) }, HTTP_STATUS.BAD_REQUEST);
        }
    }),
    async (c) => {
        const db = c.get("db");
        const userId = FrontUserId.of(c.req.valid("param").id);
        const now = new Date().toISOString();

        await db.batch([
            db.update(frontUserMaster)
                .set({ deleteFlg: true, updatedAt: now })
                .where(
                    and(
                        eq(frontUserMaster.id, userId.value),
                        eq(frontUserMaster.deleteFlg, false)
                    )
                ),
            db.update(frontUserLoginMaster)
                .set({ deleteFlg: true, updatedAt: now })
                .where(
                    and(
                        eq(frontUserLoginMaster.id, userId.value),
                        eq(frontUserLoginMaster.deleteFlg, false)
                    )
                ),
        ]);

        return c.json({ message: "ユーザーを削除しました。" }, HTTP_STATUS.OK);
    }
);

export { deleteUserManagement };
