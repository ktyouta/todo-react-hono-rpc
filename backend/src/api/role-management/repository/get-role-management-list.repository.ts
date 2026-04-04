import { eq, inArray, like, sql } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import { permissionMaster, roleMaster, rolePermission, screenMaster } from "../../../infrastructure/db";
import type { GetRoleManagementListQuerySchemaType } from "../schema/get-role-management-list-query.schema";
import type { IGetRoleManagementListRepository, RoleManagementBase, RolePermissionRow } from "./get-role-management-list.repository.interface";

export class GetRoleManagementListRepository implements IGetRoleManagementListRepository {

    static readonly LIMIT = 30;

    constructor(private readonly db: Database) { }

    /**
     * ロールを取得（name が指定された場合は部分一致フィルタ、ページネーション付き）
     */
    async findAll(query: GetRoleManagementListQuerySchemaType): Promise<RoleManagementBase[]> {
        const baseQuery = this.db
            .select({
                id: roleMaster.id,
                name: roleMaster.name,
                createdAt: roleMaster.createdAt,
                updatedAt: roleMaster.updatedAt,
            })
            .from(roleMaster);

        const filteredQuery = query.name
            ? baseQuery.where(like(roleMaster.name, `%${query.name}%`))
            : baseQuery;

        return await filteredQuery
            .orderBy(roleMaster.id)
            .limit(GetRoleManagementListRepository.LIMIT)
            .offset((query.page - 1) * GetRoleManagementListRepository.LIMIT);
    }

    /**
     * 検索条件に一致するロールの件数を取得
     */
    async count(query: GetRoleManagementListQuerySchemaType): Promise<number> {
        const baseQuery = this.db
            .select({ total: sql<number>`count(*)` })
            .from(roleMaster);

        const filteredQuery = query.name
            ? baseQuery.where(like(roleMaster.name, `%${query.name}%`))
            : baseQuery;

        const [{ total }] = await filteredQuery;
        return total;
    }

    /**
     * 指定したロールIDのパーミッション情報を取得
     */
    async findPermissionsByRoleIds(roleIds: number[]): Promise<RolePermissionRow[]> {
        return await this.db
            .select({
                roleId: rolePermission.roleId,
                permissionId: rolePermission.permissionId,
                screenKey: screenMaster.key,
                screenName: screenMaster.name,
            })
            .from(rolePermission)
            .innerJoin(permissionMaster, eq(rolePermission.permissionId, permissionMaster.id))
            .innerJoin(screenMaster, eq(permissionMaster.screenId, screenMaster.id))
            .where(inArray(rolePermission.roleId, roleIds));
    }
}
