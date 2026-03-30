import { eq } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import { permissionMaster, roleMaster, rolePermission, screenMaster } from "../../../infrastructure/db";
import type { IGetRoleManagementListRepository, RoleManagementItem } from "./get-role-management-list.repository.interface";

export class GetRoleManagementListRepository implements IGetRoleManagementListRepository {
    constructor(private readonly db: Database) {}

    async findAll(): Promise<RoleManagementItem[]> {
        const roles = await this.db
            .select({ id: roleMaster.id, name: roleMaster.name, createdAt: roleMaster.createdAt, updatedAt: roleMaster.updatedAt })
            .from(roleMaster)
            .orderBy(roleMaster.id);

        const permissionRows = await this.db
            .select({
                roleId: rolePermission.roleId,
                permissionId: rolePermission.permissionId,
                screenKey: screenMaster.key,
                screenName: screenMaster.name,
            })
            .from(rolePermission)
            .innerJoin(permissionMaster, eq(rolePermission.permissionId, permissionMaster.id))
            .innerJoin(screenMaster, eq(permissionMaster.screenId, screenMaster.id));

        const permissionMap = new Map<number, { permissionId: number; screenKey: string; screenName: string }[]>();
        for (const row of permissionRows) {
            if (!permissionMap.has(row.roleId)) {
                permissionMap.set(row.roleId, []);
            }
            permissionMap.get(row.roleId)!.push({
                permissionId: row.permissionId,
                screenKey: row.screenKey,
                screenName: row.screenName,
            });
        }

        return roles.map((role) => ({
            ...role,
            permissions: permissionMap.get(role.id) ?? [],
        }));
    }
}
