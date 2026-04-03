import { eq, like } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import { permissionMaster, roleMaster, rolePermission, screenMaster } from "../../../infrastructure/db";
import type { GetRoleManagementListQuerySchemaType } from "../schema/get-role-management-list-query.schema";
import type { IGetRoleManagementListRepository, RoleManagementBase, RolePermissionRow } from "./get-role-management-list.repository.interface";

export class GetRoleManagementListRepository implements IGetRoleManagementListRepository {
    constructor(private readonly db: Database) {}

    /**
     * ロールを取得（name が指定された場合は部分一致フィルタ）
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

        if (query.name) {
            return await baseQuery.where(like(roleMaster.name, `%${query.name}%`)).orderBy(roleMaster.id);
        }

        return await baseQuery.orderBy(roleMaster.id);
    }

    /**
     * 全ロールのパーミッション情報を一括取得
     */
    async findAllPermissions(): Promise<RolePermissionRow[]> {
        return await this.db
            .select({
                roleId: rolePermission.roleId,
                permissionId: rolePermission.permissionId,
                screenKey: screenMaster.key,
                screenName: screenMaster.name,
            })
            .from(rolePermission)
            .innerJoin(permissionMaster, eq(rolePermission.permissionId, permissionMaster.id))
            .innerJoin(screenMaster, eq(permissionMaster.screenId, screenMaster.id));
    }
}
