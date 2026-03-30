import type { IGetRoleManagementListRepository, RoleManagementBase, RoleManagementItem, RolePermissionInfo, RolePermissionRow } from "../repository/get-role-management-list.repository.interface";

/**
 * ロール一覧取得サービス
 */
export class GetRoleManagementListService {
    constructor(private readonly repository: IGetRoleManagementListRepository) { }

    /**
     * 全ロールを取得
     */
    async findAll(): Promise<RoleManagementBase[]> {
        return await this.repository.findAll();
    }

    /**
     * 全ロールのパーミッション情報を一括取得
     */
    async findAllPermissions(): Promise<RolePermissionRow[]> {
        return await this.repository.findAllPermissions();
    }

    /**
     * ロール一覧とパーミッション情報を結合
     */
    mergeRolesWithPermissions(roles: RoleManagementBase[], permissionRows: RolePermissionRow[]): RoleManagementItem[] {
        const permissionMap = new Map<number, RolePermissionInfo[]>();
        for (const row of permissionRows) {
            if (!permissionMap.has(row.roleId)) {
                permissionMap.set(row.roleId, []);
            }
            permissionMap.get(row.roleId)!.push({
                permissionId: row.permissionId,
                screenKey: row.screenKey,
                screenName: row.screenName,
            });
        }
        return roles.map((role) => ({
            ...role,
            permissions: permissionMap.get(role.id) ?? [],
        }));
    }
}
