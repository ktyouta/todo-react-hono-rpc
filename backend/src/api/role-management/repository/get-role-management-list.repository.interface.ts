import type { GetRoleManagementListQuerySchemaType } from "../schema/get-role-management-list-query.schema";

export type RolePermissionInfo = {
    permissionId: number;
    screenKey: string;
    screenName: string;
};

export type RoleManagementItem = {
    id: number;
    name: string;
    permissions: RolePermissionInfo[];
    createdAt: string;
    updatedAt: string;
};

export type RoleManagementBase = Omit<RoleManagementItem, "permissions">;

export type RolePermissionRow = RolePermissionInfo & { roleId: number };

export interface IGetRoleManagementListRepository {
    /**
     * ロールを取得（name が指定された場合は部分一致フィルタ）
     */
    findAll(query: GetRoleManagementListQuerySchemaType): Promise<RoleManagementBase[]>;
    /**
     * 全ロールのパーミッション情報を一括取得
     */
    findAllPermissions(): Promise<RolePermissionRow[]>;
}
