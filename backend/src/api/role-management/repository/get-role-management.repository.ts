import { eq } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import { permissionMaster, roleMaster, rolePermission, screenMaster } from "../../../infrastructure/db";
import type { IGetRoleManagementRepository, RoleDetail, RolePermissionDetail } from "./get-role-management.repository.interface";

export class GetRoleManagementRepository implements IGetRoleManagementRepository {
    constructor(private readonly db: Database) {}

    /**
     * IDでロールを取得
     */
    async findById(roleId: number): Promise<RoleDetail | undefined> {
        const result = await this.db
            .select({
                id: roleMaster.id,
                name: roleMaster.name,
                isProtected: roleMaster.isProtected,
                createdAt: roleMaster.createdAt,
                updatedAt: roleMaster.updatedAt,
            })
            .from(roleMaster)
            .where(eq(roleMaster.id, roleId));
        return result[0];
    }

    /**
     * ロールIDに紐づくパーミッション情報を取得
     */
    async findPermissions(roleId: number): Promise<RolePermissionDetail[]> {
        return await this.db
            .select({
                permissionId: rolePermission.permissionId,
                screenKey: screenMaster.key,
                screenName: screenMaster.name,
                isProtected: permissionMaster.isProtected,
            })
            .from(rolePermission)
            .innerJoin(permissionMaster, eq(rolePermission.permissionId, permissionMaster.id))
            .innerJoin(screenMaster, eq(permissionMaster.screenId, screenMaster.id))
            .where(eq(rolePermission.roleId, roleId));
    }
}
