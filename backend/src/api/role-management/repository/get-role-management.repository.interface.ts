import type { RoleManagementBase, RolePermissionInfo } from "./get-role-management-list.repository.interface";

export interface IGetRoleManagementRepository {
    /**
     * IDでロールを取得
     */
    findById(roleId: number): Promise<RoleManagementBase | undefined>;
    /**
     * ロールIDに紐づくパーミッション情報を取得
     */
    findPermissions(roleId: number): Promise<RolePermissionInfo[]>;
}
