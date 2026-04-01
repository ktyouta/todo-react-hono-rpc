import type { IGetRoleManagementRepository, RoleDetail, RolePermissionDetail } from "../repository/get-role-management.repository.interface";

/**
 * ロール詳細取得サービス
 */
export class GetRoleManagementService {
    constructor(private readonly repository: IGetRoleManagementRepository) {}

    /**
     * IDでロールを取得
     */
    async findRole(roleId: number): Promise<RoleDetail | undefined> {
        return await this.repository.findById(roleId);
    }

    /**
     * ロールIDに紐づくパーミッション情報を取得
     */
    async findPermissions(roleId: number): Promise<RolePermissionDetail[]> {
        return await this.repository.findPermissions(roleId);
    }
}
