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
     * 全ロールを取得
     */
    findAll(): Promise<RoleManagementBase[]>;
    /**
     * 全ロールのパーミッション情報を一括取得
     */
    findAllPermissions(): Promise<RolePermissionRow[]>;
}
