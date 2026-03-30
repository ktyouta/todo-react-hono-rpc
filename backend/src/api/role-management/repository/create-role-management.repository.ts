import { eq } from "drizzle-orm";
import { SEQ_KEY } from "../../../constant";
import type { Database } from "../../../infrastructure/db";
import { roleMaster, seqMaster } from "../../../infrastructure/db";
import type { ICreateRoleManagementRepository } from "./create-role-management.repository.interface";

export class CreateRoleManagementRepository implements ICreateRoleManagementRepository {
    constructor(private readonly db: Database) {}

    async findByName(name: string): Promise<{ id: number }[]> {
        return await this.db
            .select({ id: roleMaster.id })
            .from(roleMaster)
            .where(eq(roleMaster.name, name));
    }

    async getNextSeqId(): Promise<number | null> {
        const result = await this.db
            .select()
            .from(seqMaster)
            .where(eq(seqMaster.key, SEQ_KEY.ROLE_ID));
        return result[0]?.nextId ?? null;
    }
}
