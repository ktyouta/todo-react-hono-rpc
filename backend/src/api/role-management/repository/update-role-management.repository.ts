import { and, eq, ne } from "drizzle-orm";
import type { RoleName } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { roleMaster } from "../../../infrastructure/db";
import type { IUpdateRoleManagementRepository } from "./update-role-management.repository.interface";

export class UpdateRoleManagementRepository implements IUpdateRoleManagementRepository {
    constructor(private readonly db: Database) {}

    /**
     * IDでロールの存在確認
     */
    async findById(roleId: number): Promise<{ id: number } | undefined> {
        const result = await this.db
            .select({ id: roleMaster.id })
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
}
