import type { FrontUserId } from "../../../domain";

export interface IRestoreUserDeletedRepository {
    /**
     * ユーザーに紐づくロールがロールマスタに存在するか確認する
     */
    findRoleByUser(userId: FrontUserId): Promise<{ id: number } | undefined>;
}
