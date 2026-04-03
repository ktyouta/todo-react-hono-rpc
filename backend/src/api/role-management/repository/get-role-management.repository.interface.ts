export type RoleDetail = {
    id: number;
    name: string;
    isProtected: boolean;
    isImmutable: boolean;
    createdAt: string;
    updatedAt: string;
};

export type RolePermissionDetail = {
    permissionId: number;
    screenKey: string;
    screenName: string;
    isProtected: boolean;
};

export interface IGetRoleManagementRepository {
    /**
     * IDでロールを取得
     */
    findById(roleId: number): Promise<RoleDetail | undefined>;
    /**
     * ロールIDに紐づくパーミッション情報を取得
     */
    findPermissions(roleId: number): Promise<RolePermissionDetail[]>;
}
