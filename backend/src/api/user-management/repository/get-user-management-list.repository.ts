import { eq } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import { frontUserMaster, roleMaster } from "../../../infrastructure/db";
import type { IGetUserManagementListRepository, UserManagementItem } from "./get-user-management-list.repository.interface";

/**
 * ユーザー一覧取得リポジトリ実装
 */
export class GetUserManagementListRepository implements IGetUserManagementListRepository {
    constructor(private readonly db: Database) { }

    /**
     * 全ユーザー取得
     */
    async findAll(): Promise<UserManagementItem[]> {
        return await this.db
            .select({
                id: frontUserMaster.id,
                name: frontUserMaster.name,
                birthday: frontUserMaster.birthday,
                roleName: roleMaster.name,
                createdAt: frontUserMaster.createdAt,
                updatedAt: frontUserMaster.updatedAt,
            })
            .from(frontUserMaster)
            .innerJoin(roleMaster, eq(frontUserMaster.roleId, roleMaster.id))
            .where(eq(frontUserMaster.deleteFlg, false))
            .orderBy(frontUserMaster.id);
    }
}
