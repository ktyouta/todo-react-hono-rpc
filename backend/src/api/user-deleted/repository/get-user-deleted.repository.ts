import { and, eq } from "drizzle-orm";
import type { FrontUserId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { frontUserMaster, roleMaster } from "../../../infrastructure/db";
import type { IGetUserDeletedRepository, UserDeletedDetail } from "./get-user-deleted.repository.interface";

export class GetUserDeletedRepository implements IGetUserDeletedRepository {
    constructor(private readonly db: Database) { }

    async findById(userId: FrontUserId): Promise<UserDeletedDetail | undefined> {
        const result = await this.db
            .select({
                id: frontUserMaster.id,
                name: frontUserMaster.name,
                birthday: frontUserMaster.birthday,
                roleId: frontUserMaster.roleId,
                roleName: roleMaster.name,
                lastLoginDate: frontUserMaster.lastLoginDate,
                createdAt: frontUserMaster.createdAt,
                updatedAt: frontUserMaster.updatedAt,
            })
            .from(frontUserMaster)
            .innerJoin(roleMaster, eq(frontUserMaster.roleId, roleMaster.id))
            .where(
                and(
                    eq(frontUserMaster.id, userId.value),
                    eq(frontUserMaster.deleteFlg, true)
                )
            );
        return result[0];
    }
}
