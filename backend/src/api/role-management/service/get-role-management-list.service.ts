import type { GetRoleManagementListQuerySchemaType } from "../schema/get-role-management-list-query.schema";
import type { IGetRoleManagementListRepository, RoleManagementBase, RoleManagementItem, RolePermissionRow } from "../repository/get-role-management-list.repository.interface";

/**
 * ロール一覧取得サービス
 */
export class GetRoleManagementListService {
    constructor(private readonly repository: IGetRoleManagementListRepository) { }

    /**
     * ロールを取得（name が指定された場合は部分一致フィルタ）
     */
    async findAll(query: GetRoleManagementListQuerySchemaType): Promise<RoleManagementBase[]> {
        return await this.repository.findAll(query);
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
        const permissionMap = new Map<number, RolePermissionRow[]>();

        permissionRows.forEach((e) => {
            const roleId = e.roleId;
            let permissions = permissionMap.get(roleId);

            if (!permissions) {
                permissions = [];
                permissionMap.set(roleId, permissions);
            }

            permissions.push(e);
        });

        return roles.map((role) => ({
            ...role,
            permissions: permissionMap.get(role.id) ?? [],
        }));
    }
}
