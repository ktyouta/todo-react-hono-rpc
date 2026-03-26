import type { Database } from "../../../infrastructure/db";
import { roleMaster } from "../../../infrastructure/db";
import type { IGetRoleListRepository, RoleListItem } from "./get-role-list.repository.interface";

export class GetRoleListRepository implements IGetRoleListRepository {
    constructor(private readonly db: Database) { }

    async findAll(): Promise<RoleListItem[]> {
        return await this.db
            .select({
                id: roleMaster.id,
                name: roleMaster.name,
            })
            .from(roleMaster)
            .orderBy(roleMaster.id);
    }
}
