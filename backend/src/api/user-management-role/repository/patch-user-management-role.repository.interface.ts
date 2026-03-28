import type { FrontUserId, RoleId } from "../../../domain";

export interface IPatchUserManagementRoleRepository {
    /**
     * ロールに紐づくパーミッション取得
     * @param roleId 
     */
    getRolePermission(roleId: RoleId): Promise<string[]>;

    /**
     * ロール更新
     * @param userId 
     * @param roleId 
     */
    updateRole(userId: FrontUserId, roleId: RoleId): Promise<boolean>;
}
