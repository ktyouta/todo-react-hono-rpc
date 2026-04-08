import { and, eq, inArray } from "drizzle-orm";
import type { RoleId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { frontUserMaster, permissionMaster, rolePermission, screenMaster } from "../../../infrastructure/db";
import type { IBulkUpdateUserManagementRoleRepository } from "./bulk-update-user-management-role.repository.interface";

/**
 * ユーザー一括ロール変更リポジトリ実装
 */
export class BulkUpdateUserManagementRoleRepository implements IBulkUpdateUserManagementRoleRepository {
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
            );
        return result.map((e) => e.key);
    }

    /**
     * ユーザーのロールを一括更新
     */
    async updateRoles(ids: number[], roleId: RoleId): Promise<void> {
        const now = new Date().toISOString();
        await this.db
            .update(frontUserMaster)
            .set({ roleId: roleId.value, updatedAt: now })
            .where(
                and(
                    eq(frontUserMaster.deleteFlg, false),
                    inArray(frontUserMaster.id, ids)
                )
            );
    }
}
