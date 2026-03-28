import type { FrontUserId } from "../../../domain";
import type { IGetUserDeletedRepository } from "../repository/get-user-deleted.repository.interface";

export class GetUserDeletedService {
    constructor(private readonly repository: IGetUserDeletedRepository) { }

    async find(userId: FrontUserId) {
        return await this.repository.findById(userId);
    }
}
