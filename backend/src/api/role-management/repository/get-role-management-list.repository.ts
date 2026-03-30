import { eq } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import { permissionMaster, roleMaster, rolePermission, screenMaster } from "../../../infrastructure/db";
import type { IGetRoleManagementListRepository, RoleManagementBase, RolePermissionRow } from "./get-role-management-list.repository.interface";

export class GetRoleManagementListRepository implements IGetRoleManagementListRepository {
    constructor(private readonly db: Database) {}

    /**
     * 全ロールを取得
     */
    async findAll(): Promise<RoleManagementBase[]> {
        return await this.db
            .select({
                id: roleMaster.id,
                name: roleMaster.name,
                createdAt: roleMaster.createdAt,
                updatedAt: roleMaster.updatedAt,
            })
            .from(roleMaster)
            .orderBy(roleMaster.id);
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
