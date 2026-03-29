import type { FrontUserName } from "../../../domain";
import type { FrontUserMaster } from "../../../infrastructure/db";

/**
 * ユーザー作成リポジトリインターフェース（管理者用）
 */
export interface ICreateUserManagementRepository {
    /**
     * ユーザー名でユーザーを検索
     * @param userName ユーザー名
     */
    findByUserName(userName: FrontUserName): Promise<FrontUserMaster[]>;

    /**
     * seq_master から次のIDを取得
     * シーケンスが未初期化の場合は null を返す
     */
    getNextSeqId(): Promise<number | null>;
}
