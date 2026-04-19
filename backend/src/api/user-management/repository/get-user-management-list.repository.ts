import { and, eq, gte, like, lte, sql } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import { frontUserMaster, roleMaster } from "../../../infrastructure/db";
import type { GetUserManagementListQuerySchemaType } from "../schema/get-user-management-list-query.schema";
import type { IGetUserManagementListRepository, UserManagementItem } from "./get-user-management-list.repository.interface";

/**
 * ユーザー一覧取得リポジトリ実装
 */
export class GetUserManagementListRepository implements IGetUserManagementListRepository {

    static readonly LIMIT = 30;

    constructor(private readonly db: Database) { }

    async findAll(query: GetUserManagementListQuerySchemaType): Promise<UserManagementItem[]> {
        const conditions = this.buildConditions(query);

        return await this.db
            .select({
                id: frontUserMaster.id,
                name: frontUserMaster.name,
                birthday: frontUserMaster.birthday,
                roleName: roleMaster.name,
                createdAt: frontUserMaster.createdAt,
                updatedAt: frontUserMaster.updatedAt,
                lastLoginDate: frontUserMaster.lastLoginDate,
            })
            .from(frontUserMaster)
            .innerJoin(roleMaster, eq(frontUserMaster.roleId, roleMaster.id))
            .where(and(...conditions))
            .orderBy(frontUserMaster.id)
            .limit(GetUserManagementListRepository.LIMIT)
            .offset((query.page - 1) * GetUserManagementListRepository.LIMIT);
    }

    async count(query: GetUserManagementListQuerySchemaType): Promise<number> {
        const conditions = this.buildConditions(query);

        const [{ total }] = await this.db
            .select({ total: sql<number>`count(*)` })
            .from(frontUserMaster)
            .innerJoin(roleMaster, eq(frontUserMaster.roleId, roleMaster.id))
            .where(and(...conditions));

        return total;
    }

    private buildConditions(query: GetUserManagementListQuerySchemaType) {
        return [
            eq(frontUserMaster.deleteFlg, false),
            ...(query.name ? [like(frontUserMaster.name, `%${query.name}%`)] : []),
            ...(query.roleId ? [eq(frontUserMaster.roleId, query.roleId)] : []),
            ...(query.createdAtFrom ? [gte(frontUserMaster.createdAt, query.createdAtFrom)] : []),
            ...(query.createdAtTo ? [lte(frontUserMaster.createdAt, query.createdAtTo)] : []),
            ...(query.updatedAtFrom ? [gte(frontUserMaster.updatedAt, query.updatedAtFrom)] : []),
            ...(query.updatedAtTo ? [lte(frontUserMaster.updatedAt, query.updatedAtTo)] : []),
        ];
    }
}
