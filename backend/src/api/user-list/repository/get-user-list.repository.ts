import { eq } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import { frontUserMaster } from "../../../infrastructure/db";
import type { IGetUserListRepository, UserListItem } from "./get-user-list.repository.interface";

export class GetUserListRepository implements IGetUserListRepository {
    constructor(private readonly db: Database) { }

    async findAll(): Promise<UserListItem[]> {
        return await this.db
            .select({
                id: frontUserMaster.id,
                name: frontUserMaster.name,
            })
            .from(frontUserMaster)
            .where(eq(frontUserMaster.deleteFlg, false))
            .orderBy(frontUserMaster.id);
    }
}
