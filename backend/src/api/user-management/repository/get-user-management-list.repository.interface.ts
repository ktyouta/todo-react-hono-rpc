/**
 * ユーザー一覧取得リポジトリの戻り値型
 */
export type UserManagementItem = {
    id: number;
    name: string;
    birthday: string;
    roleName: string;
    createdAt: string;
    updatedAt: string;
};

export interface IGetUserManagementListRepository {
    findAll(): Promise<UserManagementItem[]>;
}
