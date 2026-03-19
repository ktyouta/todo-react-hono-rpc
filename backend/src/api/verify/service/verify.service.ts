import type { FrontUserId } from "../../../domain";
import type { IVerifyRepository, UserWithRole } from "../repository/verify.repository.interface";

/**
 * ログインサービス
 */
export class VerifyService {
    constructor(private readonly repository: IVerifyRepository) { }

    /**
     * ユーザー情報を取得
     */
    async getUser(userId: FrontUserId): Promise<UserWithRole | undefined> {
        return await this.repository.findByUserId(userId);
    }

    /**
     * ロールIDに紐づくパーミッション一覧を取得
     */
    async getPermissions(roleId: number): Promise<string[]> {
        return await this.repository.findPermissionsByRoleId(roleId);
    }
}
