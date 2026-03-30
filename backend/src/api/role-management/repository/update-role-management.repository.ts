import { and, eq, ne } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import { roleMaster } from "../../../infrastructure/db";
import type { IUpdateRoleManagementRepository } from "./update-role-management.repository.interface";

export class UpdateRoleManagementRepository implements IUpdateRoleManagementRepository {
    constructor(private readonly db: Database) {}

    async findById(roleId: number): Promise<{ id: number } | undefined> {
        const result = await this.db
            .select({ id: roleMaster.id })
            .from(roleMaster)
            .where(eq(roleMaster.id, roleId));
        return result[0];
    }

    async findByNameExcludingId(name: string, excludeRoleId: number): Promise<{ id: number }[]> {
        return await this.db
            .select({ id: roleMaster.id })
            .from(roleMaster)
            .where(and(eq(roleMaster.name, name), ne(roleMaster.id, excludeRoleId)));
    }
}
