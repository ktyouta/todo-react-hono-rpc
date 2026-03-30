import { eq } from "drizzle-orm";
import { SEQ_KEY } from "../../../constant";
import type { RoleName } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { roleMaster, seqMaster } from "../../../infrastructure/db";
import type { ICreateRoleManagementRepository } from "./create-role-management.repository.interface";

export class CreateRoleManagementRepository implements ICreateRoleManagementRepository {
    constructor(private readonly db: Database) {}

    /**
     * ロール名でロールを検索（重複チェック用）
     */
    async findByName(roleName: RoleName): Promise<{ id: number }[]> {
        return await this.db
            .select({ id: roleMaster.id })
            .from(roleMaster)
            .where(eq(roleMaster.name, roleName.value));
    }

    /**
     * seq_master から次のロールIDを取得
     */
    async getNextSeqId(): Promise<number | null> {
        const result = await this.db
            .select()
            .from(seqMaster)
            .where(eq(seqMaster.key, SEQ_KEY.ROLE_ID));
        return result[0]?.nextId ?? null;
    }
}
