import { and, eq } from "drizzle-orm";
import { FLG } from "../../constant";
import type { FrontUserId } from "../../domain";
import type { Database } from "../../infrastructure/db";
import { frontUserMaster, permissionMaster, rolePermission } from "../../infrastructure/db";
import type { IPermissionRepository } from "./permission.repository.interface";

/**
 * パーミッションリポジトリ実装
 */
export class PermissionRepository implements IPermissionRepository {
    constructor(private readonly db: Database) { }

    /**
     * ユーザーIDからロールIDを取得
     * @param userId ユーザーID
     */
    async getRole(userId: FrontUserId): Promise<number | undefined> {
        const result = await this.db
            .select({ roleId: frontUserMaster.roleId })
            .from(frontUserMaster)
            .where(
                and(
                    eq(frontUserMaster.id, userId.value),
                    eq(frontUserMaster.deleteFlg, FLG.OFF)
                )
            );
        return result[0]?.roleId;
    }

    /**
     * ロールIDに紐づくパーミッション（screen）一覧を取得
     * @param roleId ロールID
     */
    async getPermissions(roleId: number): Promise<string[]> {
        const result = await this.db
            .select({ screen: permissionMaster.screen })
            .from(rolePermission)
            .innerJoin(permissionMaster, eq(rolePermission.permissionId, permissionMaster.id))
            .where(eq(rolePermission.roleId, roleId));
        return result.map(r => r.screen);
    }
}
