import { and, eq } from "drizzle-orm";
import type { FrontUserId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { frontUserMaster, roleMaster } from "../../../infrastructure/db";
import type { IGetUserManagementRepository, UserManagementDetail } from "./get-user-management.repository.interface";

/**
 * ユーザー詳細取得リポジトリ実装
 */
export class GetUserManagementRepository implements IGetUserManagementRepository {
    constructor(private readonly db: Database) { }

    /**
     * IDでユーザーを取得
     */
    async findById(userId: FrontUserId): Promise<UserManagementDetail | undefined> {
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
                    eq(frontUserMaster.deleteFlg, false)
                )
            );
        return result[0];
    }
}
