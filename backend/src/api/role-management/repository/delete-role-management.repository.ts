import { and, eq } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import { frontUserMaster, roleMaster } from "../../../infrastructure/db";
import { IDeleteRoleManagementRepository, RoleItem } from "./delete-role-management.repository.interface";

export class DeleteRoleManagementRepository implements IDeleteRoleManagementRepository {
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
     * 削除対象ロールの使用チェック
     */
    async checkExistUser(roleId: number): Promise<{ id: number }[]> {
        return await this.db
            .select({ id: frontUserMaster.id })
            .from(frontUserMaster)
            .where(and(eq(frontUserMaster.roleId, roleId), eq(frontUserMaster.deleteFlg, false)));
    }
}
