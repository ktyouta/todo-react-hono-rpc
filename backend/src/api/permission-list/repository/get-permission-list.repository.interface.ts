export type PermissionListItem = {
    permissionId: number;
    screenKey: string;
    screenName: string;
    isProtected: boolean;
};

export interface IGetPermissionListRepository {
    /**
     * 全パーミッションを取得
     */
    findAll(): Promise<PermissionListItem[]>;
}
