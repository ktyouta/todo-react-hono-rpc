import type { FrontUserId } from "../../../domain";
import type { IDeleteUserManagementRepository } from "../repository/delete-user-management.repository.interface";

/**
 * ユーザー削除サービス
 */
export class DeleteUserManagementService {
    constructor(private readonly repository: IDeleteUserManagementRepository) { }

    /**
     * ユーザーが存在するか確認
     */
    async exists(userId: FrontUserId): Promise<boolean> {
        return await this.repository.exists(userId);
    }
}
