import type { FrontUserId } from "../../../domain";
import type { IGetUserManagementRepository } from "../repository/get-user-management.repository.interface";

/**
 * ユーザー詳細取得サービス
 */
export class GetUserManagementService {
    constructor(private readonly repository: IGetUserManagementRepository) { }

    /**
     * IDでユーザーを取得
     */
    async find(userId: FrontUserId) {
        return await this.repository.findById(userId);
    }
}
