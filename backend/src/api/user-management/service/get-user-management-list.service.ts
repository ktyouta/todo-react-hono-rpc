import type { GetUserManagementListQuerySchemaType } from "../schema/get-user-management-list-query.schema";
import type { IGetUserManagementListRepository, UserManagementListResult } from "../repository/get-user-management-list.repository.interface";

/**
 * ユーザー一覧取得サービス
 */
export class GetUserManagementListService {
    constructor(private readonly repository: IGetUserManagementListRepository) { }

    async findAll(query: GetUserManagementListQuerySchemaType): Promise<UserManagementListResult> {
        const [list, total] = await Promise.all([
            this.repository.findAll(query),
            this.repository.count(query),
        ]);
        return { list, total };
    }
}
