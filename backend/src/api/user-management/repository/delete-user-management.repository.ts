import { and, eq } from "drizzle-orm";
import type { FrontUserId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { frontUserMaster } from "../../../infrastructure/db";
import type { IDeleteUserManagementRepository } from "./delete-user-management.repository.interface";

/**
 * ユーザー削除リポジトリ実装
 */
export class DeleteUserManagementRepository implements IDeleteUserManagementRepository {
    constructor(private readonly db: Database) { }

    /**
     * ユーザーが存在するか確認
     */
    async exists(userId: FrontUserId): Promise<boolean> {
        const result = await this.db
            .select({ id: frontUserMaster.id })
            .from(frontUserMaster)
            .where(
                and(
                    eq(frontUserMaster.id, userId.value),
                    eq(frontUserMaster.deleteFlg, false)
                )
            );
        return result.length > 0;
    }
}
