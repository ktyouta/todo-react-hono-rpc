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

export interface IGetRoleManagementListRepository {
    findAll(): Promise<RoleManagementItem[]>;
}
