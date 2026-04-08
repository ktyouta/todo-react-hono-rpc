import type { RoleId } from "../../../domain";

export interface IBulkUpdateUserManagementRoleRepository {
    /**
     * ロールに紐づくパーミッション取得
     * @param roleId
     */
    getRolePermission(roleId: RoleId): Promise<string[]>;

    /**
     * ユーザーのロールを一括更新
     * @param ids 対象ユーザーIDリスト
     * @param roleId 変更先ロールID
     */
    updateRoles(ids: number[], roleId: RoleId): Promise<void>;
}
