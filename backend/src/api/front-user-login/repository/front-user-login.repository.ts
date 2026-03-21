import { and, eq } from "drizzle-orm";
import type { FrontUserId, FrontUserName } from "../../../domain";
import type {
  Database,
  FrontUserLoginMaster,
} from "../../../infrastructure/db";
import { frontUserLoginMaster, frontUserMaster, permissionMaster, roleMaster, rolePermission } from "../../../infrastructure/db";
import type { IFrontUserLoginRepository, UserWithRole } from "./front-user-login.repository.interface";

/**
 * ログインリポジトリ実装
 */
export class FrontUserLoginRepository implements IFrontUserLoginRepository {
  constructor(private readonly db: Database) { }

  /**
   * ユーザー名でログイン情報を取得
   * @param userName ユーザー名
   */
  async getLoginUser(
    userName: FrontUserName
  ): Promise<FrontUserLoginMaster | undefined> {
    const result = await this.db
      .select()
      .from(frontUserLoginMaster)
      .where(
        and(
          eq(frontUserLoginMaster.name, userName.value),
          eq(frontUserLoginMaster.deleteFlg, false)
        )
      );
    return result[0];
  }

  /**
   * ユーザーIDでユーザー情報を取得
   * @param userId ユーザーID
   */
  async getUserInfo(userId: FrontUserId): Promise<UserWithRole | undefined> {
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
          eq(frontUserMaster.deleteFlg, false)
        )
      );
    return result[0];
  }

  /**
   * ロールIDに紐づくパーミッション（screen）一覧を取得
   * @param roleId ロールID
   */
  async getPermissionsByRoleId(roleId: number): Promise<string[]> {
    const result = await this.db
      .select({ screen: permissionMaster.screen })
      .from(rolePermission)
      .innerJoin(permissionMaster, eq(rolePermission.permissionId, permissionMaster.id))
      .where(eq(rolePermission.roleId, roleId));
    return result.map(r => r.screen);
  }

  /**
   * 最終ログイン日時を更新
   * @param userId ユーザーID
   */
  async updateLastLoginDate(userId: FrontUserId): Promise<void> {
    const now = new Date().toISOString();
    await this.db
      .update(frontUserMaster)
      .set({
        lastLoginDate: now,
        updatedAt: now,
      })
      .where(eq(frontUserMaster.id, userId.value));
  }
}
