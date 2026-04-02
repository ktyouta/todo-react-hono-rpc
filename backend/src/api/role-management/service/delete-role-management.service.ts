import { DeleteRoleManagementRepository } from "../repository/delete-role-management.repository";
import { RoleItem } from "../repository/delete-role-management.repository.interface";

/**
 * ロール削除サービス
 */
export class DeleteRoleManagementService {
    constructor(private readonly repository: DeleteRoleManagementRepository) { }

    /**
     * ロール取得
     */
    async findRole(roleId: number): Promise<RoleItem | undefined> {
        return await this.repository.findById(roleId);
    }

    /**
     * 削除対象ロールの使用チェック
     */
    async checkExistUser(roleId: number): Promise<{ id: number }[]> {
        return await this.repository.checkExistUser(roleId);
    }
}
