import { eq } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import { permissionMaster, roleMaster, rolePermission, screenMaster } from "../../../infrastructure/db";
import type { RoleManagementItem } from "./get-role-management-list.repository.interface";
import type { IGetRoleManagementRepository } from "./get-role-management.repository.interface";

export class GetRoleManagementRepository implements IGetRoleManagementRepository {
    constructor(private readonly db: Database) {}

    async findById(roleId: number): Promise<RoleManagementItem | undefined> {
        const roles = await this.db
            .select({ id: roleMaster.id, name: roleMaster.name, createdAt: roleMaster.createdAt, updatedAt: roleMaster.updatedAt })
            .from(roleMaster)
            .where(eq(roleMaster.id, roleId));

        const role = roles[0];
        if (!role) return undefined;

        const permissionRows = await this.db
            .select({
                permissionId: rolePermission.permissionId,
                screenKey: screenMaster.key,
                screenName: screenMaster.name,
            })
            .from(rolePermission)
            .innerJoin(permissionMaster, eq(rolePermission.permissionId, permissionMaster.id))
            .innerJoin(screenMaster, eq(permissionMaster.screenId, screenMaster.id))
            .where(eq(rolePermission.roleId, roleId));

        return {
            ...role,
            permissions: permissionRows,
        };
    }
}
