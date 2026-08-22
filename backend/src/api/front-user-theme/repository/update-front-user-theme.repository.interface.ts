import type { FrontUserId } from "../../../domain";
import type { FrontUserMaster } from "../../../infrastructure/db";

/**
 * ダークモード設定更新リポジトリインターフェース
 */
export interface IUpdateFrontUserThemeRepository {
    /**
     * ダークモード設定を更新
     * @param userId ユーザーID
     * @param darkMode ダークモード設定
     */
    updateDarkMode(userId: FrontUserId, darkMode: boolean): Promise<FrontUserMaster | undefined>;
}
