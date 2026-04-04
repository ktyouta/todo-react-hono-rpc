import type { GetRoleManagementListQuerySchemaType } from "../schema/get-role-management-list-query.schema";
import type { IGetRoleManagementListRepository, RoleManagementBase, RoleManagementItem, RoleManagementListResult, RolePermissionRow } from "../repository/get-role-management-list.repository.interface";

/**
 * ロール一覧取得サービス
 */
export class GetRoleManagementListService {
    constructor(private readonly repository: IGetRoleManagementListRepository) { }

    /**
     * ロール一覧とパーミッション情報を取得して結合した結果を返す
     */
    async findAll(query: GetRoleManagementListQuerySchemaType): Promise<RoleManagementListResult> {
        const [roles, total] = await Promise.all([
            this.repository.findAll(query),
            this.repository.count(query),
        ]);

        const roleIds = roles.map((r) => r.id);
        const permissionRows = roleIds.length > 0
            ? await this.repository.findPermissionsByRoleIds(roleIds)
            : [];

        const list = this.mergeRolesWithPermissions(roles, permissionRows);
        return { list, total };
    }

    /**
     * ロール一覧とパーミッション情報を結合
     */
    private mergeRolesWithPermissions(roles: RoleManagementBase[], permissionRows: RolePermissionRow[]): RoleManagementItem[] {
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
