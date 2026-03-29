import { and, eq } from "drizzle-orm";
import type { FrontUserName } from "../../../domain";
import type { DbClient, FrontUserMaster } from "../../../infrastructure/db";
import { frontUserMaster, seqMaster } from "../../../infrastructure/db";
import { SEQ_KEY } from "../../../constant";
import type { ICreateUserManagementRepository } from "./create-user-management.repository.interface";

/**
 * ユーザー作成リポジトリ実装（管理者用）
 */
export class CreateUserManagementRepository implements ICreateUserManagementRepository {
    constructor(private readonly db: DbClient) { }

    async findByUserName(userName: FrontUserName): Promise<FrontUserMaster[]> {
        return await this.db
            .select()
            .from(frontUserMaster)
            .where(
                and(
                    eq(frontUserMaster.name, userName.value),
                    eq(frontUserMaster.deleteFlg, false)
                )
            );
    }

    async getNextSeqId(): Promise<number | null> {
        const result = await this.db
            .select()
            .from(seqMaster)
            .where(eq(seqMaster.key, SEQ_KEY.FRONT_USER_ID));
        return result[0]?.nextId ?? null;
    }
}
