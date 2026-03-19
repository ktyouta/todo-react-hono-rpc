import type { FrontUserId } from "../../domain";

/**
 * パーミッションリポジトリインターフェース
 */
export interface IPermissionRepository {
    /**
     * ユーザーのロールIDを取得
     * @param userId ユーザーID
     */
    getRole(userId: FrontUserId): Promise<number | undefined>;

    /**
     * ロールIDに紐づくパーミッション（screen）一覧を取得
     * @param roleId ロールID
     */
    getPermissions(roleId: number): Promise<string[]>;
}
