import { eq } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import { permissionMaster, screenMaster } from "../../../infrastructure/db";
import type { IGetPermissionListRepository, PermissionListItem } from "./get-permission-list.repository.interface";

export class GetPermissionListRepository implements IGetPermissionListRepository {
    constructor(private readonly db: Database) { }

    /**
     * 全パーミッションを取得
     */
    async findAll(): Promise<PermissionListItem[]> {
        return await this.db
            .select({
                permissionId: permissionMaster.id,
                screenKey: screenMaster.key,
                screenName: screenMaster.name,
                isProtected: permissionMaster.isProtected,
            })
            .from(permissionMaster)
            .innerJoin(screenMaster, eq(permissionMaster.screenId, screenMaster.id))
            .orderBy(permissionMaster.id);
    }
}
