import type { FrontUserId } from "../../../domain";
import type { IRestoreUserDeletedRepository } from "../repository/restore-user-deleted.repository.interface";

export class RestoreUserDeletedService {
    constructor(private readonly repository: IRestoreUserDeletedRepository) { }

    /**
     * ユーザーに紐づくロールの存在を確認する
     */
    async findUser(userId: FrontUserId): Promise<{ id: number } | undefined> {
        return await this.repository.findRoleByUser(userId);
    }
}
