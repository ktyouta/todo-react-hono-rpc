import { and, eq } from "drizzle-orm";
import type { FrontUserId } from "../../../domain";
import type { DbClient, FrontUserMaster } from "../../../infrastructure/db";
import { frontUserMaster } from "../../../infrastructure/db";
import type { IUpdateFrontUserThemeRepository } from "./update-front-user-theme.repository.interface";

/**
 * ダークモード設定更新リポジトリ実装
 */
export class UpdateFrontUserThemeRepository implements IUpdateFrontUserThemeRepository {
    constructor(private readonly db: DbClient) { }

    /**
     * ダークモード設定を更新
     * @param userId ユーザーID
     * @param darkMode ダークモード設定
     */
    async updateDarkMode(userId: FrontUserId, darkMode: boolean): Promise<FrontUserMaster | undefined> {
        const now = new Date().toISOString();
        const result = await this.db
            .update(frontUserMaster)
            .set({ darkMode, updatedAt: now })
            .where(
                and(
                    eq(frontUserMaster.id, userId.value),
                    eq(frontUserMaster.deleteFlg, false)
                )
            )
            .returning();
        return result[0];
    }
}
