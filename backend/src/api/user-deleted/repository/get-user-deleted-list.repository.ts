import { and, eq, gte, like, lte, sql } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import { frontUserMaster, roleMaster } from "../../../infrastructure/db";
import type { GetUserDeletedListQuerySchemaType } from "../schema/get-user-deleted-list-query.schema";
import type { IGetUserDeletedListRepository, UserDeletedListItem } from "./get-user-deleted-list.repository.interface";

export class GetUserDeletedListRepository implements IGetUserDeletedListRepository {

    static readonly LIMIT = 30;

    constructor(private readonly db: Database) { }

    async findAll(query: GetUserDeletedListQuerySchemaType): Promise<UserDeletedListItem[]> {
        const conditions = this.buildConditions(query);

        return await this.db
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
            .where(and(...conditions))
            .orderBy(frontUserMaster.id)
            .limit(GetUserDeletedListRepository.LIMIT)
            .offset((query.page - 1) * GetUserDeletedListRepository.LIMIT);
    }

    async count(query: GetUserDeletedListQuerySchemaType): Promise<number> {
        const conditions = this.buildConditions(query);

        const [{ total }] = await this.db
            .select({ total: sql<number>`count(*)` })
            .from(frontUserMaster)
            .innerJoin(roleMaster, eq(frontUserMaster.roleId, roleMaster.id))
            .where(and(...conditions));

        return total;
    }

    private buildConditions(query: GetUserDeletedListQuerySchemaType) {
        return [
            eq(frontUserMaster.deleteFlg, true),
            ...(query.name ? [like(frontUserMaster.name, `%${query.name}%`)] : []),
            ...(query.roleId ? [eq(frontUserMaster.roleId, query.roleId)] : []),
            ...(query.createdAtFrom ? [gte(frontUserMaster.createdAt, query.createdAtFrom)] : []),
            ...(query.createdAtTo ? [lte(frontUserMaster.createdAt, query.createdAtTo)] : []),
            ...(query.updatedAtFrom ? [gte(frontUserMaster.updatedAt, query.updatedAtFrom)] : []),
            ...(query.updatedAtTo ? [lte(frontUserMaster.updatedAt, query.updatedAtTo)] : []),
        ];
    }
}
