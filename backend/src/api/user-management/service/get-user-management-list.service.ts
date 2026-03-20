import type { IGetUserManagementListRepository } from "../repository/get-user-management-list.repository.interface";

/**
 * ユーザー一覧取得サービス
 */
export class GetUserManagementListService {
    constructor(private readonly repository: IGetUserManagementListRepository) { }

    /**
     * 全ユーザー取得
     */
    async findAll() {
        return await this.repository.findAll();
    }
}
