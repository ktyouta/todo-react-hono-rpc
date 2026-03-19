import { and, eq } from "drizzle-orm";
import { FLG } from "../../../constant";
import type { FrontUserId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { frontUserMaster, permissionMaster, roleMaster, rolePermission } from "../../../infrastructure/db";
import type { IVerifyRepository, UserWithRole } from "./verify.repository.interface";

/**
 * 認証チェックリポジトリ実装
 */
export class VerifyRepository implements IVerifyRepository {
    constructor(private readonly db: Database) { }

    /**
     * ユーザーIDでユーザー情報を取得
     * @param userId ユーザーID
     */
    async findByUserId(userId: FrontUserId): Promise<UserWithRole | undefined> {
        const result = await this.db
            .select({
                id: frontUserMaster.id,
                name: frontUserMaster.name,
                birthday: frontUserMaster.birthday,
                roleId: frontUserMaster.roleId,
                role: roleMaster.name,
            })
            .from(frontUserMaster)
            .innerJoin(roleMaster, eq(frontUserMaster.roleId, roleMaster.id))
            .where(
                and(
                    eq(frontUserMaster.id, userId.value),
                    eq(frontUserMaster.deleteFlg, FLG.OFF)
                )
            );
        return result[0];
    }

    /**
     * ロールIDに紐づくパーミッション（screen）一覧を取得
     * @param roleId ロールID
     */
    async findPermissionsByRoleId(roleId: number): Promise<string[]> {
        const result = await this.db
            .select({ screen: permissionMaster.screen })
            .from(rolePermission)
            .innerJoin(permissionMaster, eq(rolePermission.permissionId, permissionMaster.id))
            .where(eq(rolePermission.roleId, roleId));
        return result.map(r => r.screen);
    }
}
