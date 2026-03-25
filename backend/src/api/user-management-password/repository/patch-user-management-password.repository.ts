import { and, eq } from "drizzle-orm";
import type { FrontUserId, FrontUserPassword } from "../../../domain";
import type { Database, FrontUserLoginMaster } from "../../../infrastructure/db";
import { frontUserLoginMaster } from "../../../infrastructure/db";
import type { IPatchUserManagementPasswordRepository } from "./patch-user-management-password.repository.interface";

/**
 * パスワードリセットリポジトリ実装
 */
export class PatchUserManagementPasswordRepository implements IPatchUserManagementPasswordRepository {
    constructor(private readonly db: Database) { }

    /**
     * ログイン情報を取得
     */
    async getLoginUser(userId: FrontUserId): Promise<FrontUserLoginMaster | undefined> {
        const result = await this.db
            .select()
            .from(frontUserLoginMaster)
            .where(
                and(
                    eq(frontUserLoginMaster.id, userId.value),
                    eq(frontUserLoginMaster.deleteFlg, false)
                )
            );
        return result[0];
    }

    /**
     * パスワードを更新
     */
    async updatePassword(userId: FrontUserId, password: FrontUserPassword): Promise<boolean> {
        const now = new Date().toISOString();
        const result = await this.db
            .update(frontUserLoginMaster)
            .set({
                password: password.value,
                updatedAt: now,
            })
            .where(
                and(
                    eq(frontUserLoginMaster.id, userId.value),
                    eq(frontUserLoginMaster.deleteFlg, false)
                )
            )
            .returning();
        return result.length > 0;
    }
}
