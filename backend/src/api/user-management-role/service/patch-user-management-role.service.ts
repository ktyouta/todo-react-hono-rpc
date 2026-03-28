import type { FrontUserId, RoleId } from "../../../domain";
import type { IPatchUserManagementRoleRepository } from "../repository/patch-user-management-role.repository.interface";

/**
 * ロール変更サービス
 */
export class PatchUserManagementRoleService {
    constructor(private readonly repository: IPatchUserManagementRoleRepository) { }

    /**
     * ロールを更新
     */
    async getRolePermission(roleId: RoleId): Promise<string[]> {
        return await this.repository.getRolePermission(roleId);
    }

    /**
     * ロールを更新
     */
    async updateRole(userId: FrontUserId, roleId: RoleId): Promise<boolean> {
        return await this.repository.updateRole(userId, roleId);
    }
}
