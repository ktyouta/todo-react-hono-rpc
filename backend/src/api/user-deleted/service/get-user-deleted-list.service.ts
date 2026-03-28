import type { IGetUserDeletedListRepository, UserDeletedListResult } from "../repository/get-user-deleted-list.repository.interface";
import type { GetUserDeletedListQuerySchemaType } from "../schema/get-user-deleted-list-query.schema";

export class GetUserDeletedListService {
    constructor(private readonly repository: IGetUserDeletedListRepository) { }

    async findAll(query: GetUserDeletedListQuerySchemaType): Promise<UserDeletedListResult> {
        const [list, total] = await Promise.all([
            this.repository.findAll(query),
            this.repository.count(query),
        ]);
        return { list, total };
    }
}
