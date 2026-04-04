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

export type RoleManagementListResult = {
    list: RoleManagementItem[];
    total: number;
};

export interface IGetRoleManagementListRepository {
    /**
     * ロールを取得（name が指定された場合は部分一致フィルタ、ページネーション付き）
     */
    findAll(query: GetRoleManagementListQuerySchemaType): Promise<RoleManagementBase[]>;
    /**
     * 検索条件に一致するロールの件数を取得
     */
    count(query: GetRoleManagementListQuerySchemaType): Promise<number>;
    /**
     * 指定したロールIDのパーミッション情報を取得
     */
    findPermissionsByRoleIds(roleIds: number[]): Promise<RolePermissionRow[]>;
}
