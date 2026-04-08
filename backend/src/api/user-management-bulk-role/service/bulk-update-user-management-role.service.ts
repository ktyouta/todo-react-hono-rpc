import type { RoleId } from "../../../domain";
import type { IBulkUpdateUserManagementRoleRepository } from "../repository/bulk-update-user-management-role.repository.interface";

/**
 * ユーザー一括ロール変更サービス
 */
export class BulkUpdateUserManagementRoleService {
    constructor(private readonly repository: IBulkUpdateUserManagementRoleRepository) { }

    /**
     * ロールに紐づくパーミッション取得
     */
    async getRolePermission(roleId: RoleId): Promise<string[]> {
        return await this.repository.getRolePermission(roleId);
    }

    /**
     * ユーザーのロールを一括更新
     */
    async updateRoles(ids: number[], roleId: RoleId): Promise<void> {
        await this.repository.updateRoles(ids, roleId);
    }
}
