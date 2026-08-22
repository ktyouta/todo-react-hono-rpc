import type { FrontUserId } from "../../../domain";
import type { FrontUserMaster } from "../../../infrastructure/db";
import type { IUpdateFrontUserThemeRepository } from "../repository";

/**
 * ダークモード設定更新サービス
 */
export class UpdateFrontUserThemeService {
    constructor(private readonly repository: IUpdateFrontUserThemeRepository) { }

    /**
     * ダークモード設定を更新
     * @param userId ユーザーID
     * @param darkMode ダークモード設定
     */
    async updateDarkMode(userId: FrontUserId, darkMode: boolean): Promise<FrontUserMaster | undefined> {
        return await this.repository.updateDarkMode(userId, darkMode);
    }
}
