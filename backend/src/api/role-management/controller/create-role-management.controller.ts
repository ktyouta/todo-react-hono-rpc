import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS, SEQ_KEY } from "../../../constant";
import { PermissionId, RoleName } from "../../../domain";
import { roleMaster, rolePermission, seqMaster } from "../../../infrastructure/db";
import { requirePermission } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { formatZodErrors } from "../../../util";
import { CreateRoleManagementRepository } from "../repository/create-role-management.repository";
import { CreateRoleManagementSchema } from "../schema/create-role-management.schema";

/**
 * ロール作成（管理者用）
 * @route POST /api/v1/role-management
 */
const createRoleManagement = new Hono<AppEnv>().post(
    API_ENDPOINT.ROLE_MANAGEMENT,
    requirePermission("role_create"),
    zValidator("json", CreateRoleManagementSchema, (result, c) => {
        if (!result.success) {
            const data = formatZodErrors(result.error);
            const message = data.map((e) => e.message);
            return c.json({ message, data }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }
    }),
    async (c) => {
        const body = c.req.valid("json");
        const db = c.get("db");
        const repository = new CreateRoleManagementRepository(db);

        const roleName = new RoleName(body.name);
        const permissionIds = body.permissionIds.map((id) => new PermissionId(id));

        // ロール名重複チェック
        const existing = await repository.findByName(roleName);
        if (existing.length > 0) {
            return c.json({ message: "既に同じ名前のロールが存在しています。" }, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        }

        // ID採番
        const nextId = await repository.getNextSeqId();
        if (nextId === null) {
            return c.json({ message: "シーケンスが初期化されていません。" }, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        const now = new Date().toISOString();

        await db.batch([
            db.update(seqMaster)
                .set({ nextId: nextId + 1, updatedAt: now })
                .where(eq(seqMaster.key, SEQ_KEY.ROLE_ID)),
            db.insert(roleMaster).values({
                id: nextId,
                name: roleName.value,
                createdAt: now,
                updatedAt: now,
            }),
            ...permissionIds.map((permissionId) =>
                db.insert(rolePermission).values({
                    roleId: nextId,
                    permissionId: permissionId.value,
                })
            ),
        ]);

        return c.json(
            {
                message: "ロールを作成しました。",
                data: { id: nextId, name: roleName.value, createdAt: now, updatedAt: now },
            },
            HTTP_STATUS.CREATED
        );
    }
);

export { createRoleManagement };
