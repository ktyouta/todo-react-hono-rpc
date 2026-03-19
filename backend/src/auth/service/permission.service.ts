import type { FrontUserId } from "../../domain";
import type { IPermissionRepository } from "../repository/permission.repository.interface";

/**
 * パーミッションサービス
 */
export class PermissionService {
    constructor(private readonly repository: IPermissionRepository) { }

    /**
     * ユーザーIDに紐づくパーミッション一覧を取得
     * @param userId ユーザーID
     */
    async getPermissions(userId: FrontUserId): Promise<string[]> {
        const roleId = await this.repository.getRole(userId);
        if (roleId === undefined) return [];
        return await this.repository.getPermissions(roleId);
    }
}
