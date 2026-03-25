import { and, eq } from "drizzle-orm";
import type { FrontUserId, RoleId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { frontUserMaster } from "../../../infrastructure/db";
import type { IPatchUserManagementRoleRepository } from "./patch-user-management-role.repository.interface";

/**
 * ロール変更リポジトリ実装
 */
export class PatchUserManagementRoleRepository implements IPatchUserManagementRoleRepository {
    constructor(private readonly db: Database) { }

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
