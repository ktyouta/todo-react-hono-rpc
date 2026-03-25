import type { FrontUserId, FrontUserPassword } from "../../../domain";
import type { FrontUserLoginMaster } from "../../../infrastructure/db";
import type { IPatchUserManagementPasswordRepository } from "../repository/patch-user-management-password.repository.interface";

/**
 * パスワードリセットサービス
 */
export class PatchUserManagementPasswordService {
    constructor(private readonly repository: IPatchUserManagementPasswordRepository) { }

    /**
     * ログイン情報を取得
     */
    async getLoginUser(userId: FrontUserId): Promise<FrontUserLoginMaster | undefined> {
        return await this.repository.getLoginUser(userId);
    }

    /**
     * パスワードを更新
     */
    async updatePassword(userId: FrontUserId, password: FrontUserPassword): Promise<boolean> {
        return await this.repository.updatePassword(userId, password);
    }
}
