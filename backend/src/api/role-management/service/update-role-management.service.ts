import { PermissionId, RoleName } from "../../../domain";
import type { IUpdateRoleManagementRepository, RoleItem } from "../repository/update-role-management.repository.interface";

/**
 * ロール更新サービス
 */
export class UpdateRoleManagementService {
    constructor(private readonly repository: IUpdateRoleManagementRepository) { }

    /**
     * IDでロールを取得
     */
    async findRole(roleId: number): Promise<RoleItem | undefined> {
        return await this.repository.findById(roleId);
    }

    /**
     * ロール名でロールを検索（自身を除いた重複チェック用）
     */
    async findByNameExcludingId(roleName: RoleName, excludeRoleId: number): Promise<{ id: number }[]> {
        return await this.repository.findByNameExcludingId(roleName, excludeRoleId);
    }

    /**
     * 設定必須（保護対象）のパーミッションのうち、指定されたパーミッションIDに含まれていないものを取得
     */
    async findMissingProtectedPermissions(permissionIds: PermissionId[]): Promise<{ id: number }[]> {
        return await this.repository.findMissingProtectedPermissions(permissionIds);
    }
}
