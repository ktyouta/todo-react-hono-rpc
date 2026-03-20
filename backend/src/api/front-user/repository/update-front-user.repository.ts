import { and, eq, ne } from "drizzle-orm";
import { FLG } from "../../../constant";
import type { FrontUserId, FrontUserName } from "../../../domain";
import type { DbClient } from "../../../infrastructure/db";
import { frontUserMaster } from "../../../infrastructure/db";
import type { IUpdateFrontUserRepository } from "./update-front-user.repository.interface";

/**
 * ユーザー更新リポジトリ実装
 */
export class UpdateFrontUserRepository implements IUpdateFrontUserRepository {
  constructor(private readonly db: DbClient) { }

  /**
   * 他のユーザーで同じユーザー名が存在するかチェック
   * @param userId 自身のユーザーID
   * @param userName ユーザー名
   */
  async checkUserNameExists(
    userId: FrontUserId,
    userName: FrontUserName
  ): Promise<boolean> {
    const result = await this.db
      .select()
      .from(frontUserMaster)
      .where(
        and(
          eq(frontUserMaster.name, userName.value),
          ne(frontUserMaster.id, userId.value),
          eq(frontUserMaster.deleteFlg, FLG.OFF)
        )
      );
    return result.length > 0;
  }

}
