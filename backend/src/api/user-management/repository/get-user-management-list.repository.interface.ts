import type { GetUserManagementListQuerySchemaType } from "../schema/get-user-management-list-query.schema";

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

export type UserManagementListResult = {
    list: UserManagementItem[];
    total: number;
};

export interface IGetUserManagementListRepository {
    findAll(query: GetUserManagementListQuerySchemaType): Promise<UserManagementItem[]>;
    count(query: GetUserManagementListQuerySchemaType): Promise<number>;
}
