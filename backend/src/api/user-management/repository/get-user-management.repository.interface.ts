import type { FrontUserId } from "../../../domain";

/**
 * ユーザー詳細取得リポジトリの戻り値型
 */
export type UserManagementDetail = {
    id: number;
    name: string;
    birthday: string;
    roleId: number;
    roleName: string;
    lastLoginDate: string | null;
    createdAt: string;
    updatedAt: string;
};

export interface IGetUserManagementRepository {
    findById(userId: FrontUserId): Promise<UserManagementDetail | undefined>;
}
