import { and, eq } from "drizzle-orm";
import type { FrontUserName } from "../../../domain";
import type { DbClient, FrontUserMaster } from "../../../infrastructure/db";
import { frontUserMaster, permissionMaster, roleMaster, rolePermission } from "../../../infrastructure/db";
import type { ICreateFrontUserRepository } from "./create-front-user.repository.interface";

/**
 * ユーザー作成リポジトリ実装
 */
export class CreateFrontUserRepository implements ICreateFrontUserRepository {
  constructor(private readonly db: DbClient) { }

  /**
   * ユーザー名でユーザーを検索
   * @param userName ユーザー名
   */
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

  async findRoleNameById(roleId: number): Promise<string> {
    const result = await this.db
      .select({ name: roleMaster.name })
      .from(roleMaster)
      .where(eq(roleMaster.id, roleId));
    return result[0].name;
  }

  async findPermissionsByRoleId(roleId: number): Promise<string[]> {
    const result = await this.db
      .select({ screen: permissionMaster.screen })
      .from(rolePermission)
      .innerJoin(permissionMaster, eq(rolePermission.permissionId, permissionMaster.id))
      .where(eq(rolePermission.roleId, roleId));
    return result.map(r => r.screen);
  }
}
