import { and, eq, ne, notInArray } from "drizzle-orm";
import type { PermissionId, RoleName } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { permissionMaster, roleMaster } from "../../../infrastructure/db";
import type { IUpdateRoleManagementRepository, RoleItem } from "./update-role-management.repository.interface";

export class UpdateRoleManagementRepository implements IUpdateRoleManagementRepository {
    constructor(private readonly db: Database) { }

    /**
     * IDでロールの存在確認
     */
    async findById(roleId: number): Promise<RoleItem | undefined> {
        const result = await this.db
            .select({
                id: roleMaster.id,
                name: roleMaster.name,
                isProtected: roleMaster.isProtected
            })
            .from(roleMaster)
            .where(eq(roleMaster.id, roleId));
        return result[0];
    }

    /**
     * ロール名でロールを検索（自身を除いた重複チェック用）
     */
    async findByNameExcludingId(roleName: RoleName, excludeRoleId: number): Promise<{ id: number }[]> {
        return await this.db
            .select({ id: roleMaster.id })
            .from(roleMaster)
            .where(and(eq(roleMaster.name, roleName.value), ne(roleMaster.id, excludeRoleId)));
    }

    /**
     * 設定必須（保護対象）のパーミッションのうち、指定されたパーミッションIDに含まれていないものを取得
     */
    async findMissingProtectedPermissions(permissionIds: PermissionId[]): Promise<{ id: number }[]> {
        return await this.db
            .select({ id: permissionMaster.id })
            .from(permissionMaster)
            .where(and(
                eq(permissionMaster.isProtected, true),
                notInArray(permissionMaster.id, permissionIds.map((e) => e.value))
            ));
    }
}
