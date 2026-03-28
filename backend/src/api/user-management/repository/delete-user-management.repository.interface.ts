import type { FrontUserId } from "../../../domain";

export interface IDeleteUserManagementRepository {
    /**
     * ユーザーが存在するか確認
     * @param userId
     */
    exists(userId: FrontUserId): Promise<boolean>;
}
