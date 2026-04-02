import { eq } from "drizzle-orm";
import type { FrontUserId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { frontUserMaster, roleMaster } from "../../../infrastructure/db";
import type { IRestoreUserDeletedRepository } from "./restore-user-deleted.repository.interface";

export class RestoreUserDeletedRepository implements IRestoreUserDeletedRepository {
    constructor(private readonly db: Database) { }

    /**
     * ユーザーに紐づくロールがロールマスタに存在するか確認する
     */
    async findRoleByUser(userId: FrontUserId): Promise<{ id: number } | undefined> {
        const result = await this.db
            .select({ id: roleMaster.id })
            .from(frontUserMaster)
            .innerJoin(roleMaster, eq(frontUserMaster.roleId, roleMaster.id))
            .where(eq(frontUserMaster.id, userId.value));
        return result[0];
    }
}
