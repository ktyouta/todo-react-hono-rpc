import type { FrontUserId } from "../../../domain";

/**
 * ユーザー情報（ロール付き）
 */
export type UserWithRole = {
    id: number;
    name: string;
    birthday: string;
    roleId: number;
    role: string;
};


/**
 * 認証チェックリポジトリインターフェース
 */
export interface IVerifyRepository {
    /**
     * ユーザーIDでユーザー情報を取得
     * @param userId ユーザーID
     */
    findByUserId(userId: FrontUserId): Promise<UserWithRole | undefined>;

    /**
     * ロールIDに紐づくパーミッション（screen）一覧を取得
     * @param roleId ロールID
     */
    findPermissionsByRoleId(roleId: number): Promise<string[]>;
}
