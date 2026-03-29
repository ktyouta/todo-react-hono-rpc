import { and, eq } from "drizzle-orm";
import type { FrontUserId, RoleId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { frontUserMaster, permissionMaster, rolePermission, screenMaster } from "../../../infrastructure/db";
import type { IPatchUserManagementRoleRepository } from "./patch-user-management-role.repository.interface";

/**
 * ロール変更リポジトリ実装
 */
export class PatchUserManagementRoleRepository implements IPatchUserManagementRoleRepository {
    constructor(private readonly db: Database) { }

    /**
     * ロールに紐づくパーミッション取得
     */
    async getRolePermission(roleId: RoleId): Promise<string[]> {
        const result = await this.db
            .select({
                key: screenMaster.key,
            })
            .from(rolePermission)
            .innerJoin(permissionMaster, eq(permissionMaster.id, rolePermission.permissionId))
            .innerJoin(screenMaster, eq(permissionMaster.screenId, screenMaster.id))
            .where(
                and(
                    eq(rolePermission.roleId, roleId.value),
                )
            )
        return result.map((e => e.key));
    }

    /**
     * ロールを更新
     */
    async updateRole(userId: FrontUserId, roleId: RoleId): Promise<boolean> {
        const now = new Date().toISOString();
        const result = await this.db
            .update(frontUserMaster)
            .set({
                roleId: roleId.value,
                updatedAt: now,
            })
            .where(
                and(
                    eq(frontUserMaster.id, userId.value),
                    eq(frontUserMaster.deleteFlg, false)
                )
            )
            .returning();
        return result.length > 0;
    }
}
