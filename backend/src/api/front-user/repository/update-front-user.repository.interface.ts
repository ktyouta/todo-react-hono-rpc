import type { FrontUserId, FrontUserName } from "../../../domain";

/**
 * ユーザー更新リポジトリインターフェース
 */
export interface IUpdateFrontUserRepository {
  /**
   * 他のユーザーで同じユーザー名が存在するかチェック
   * @param userId 自身のユーザーID
   * @param userName ユーザー名
   */
  checkUserNameExists(userId: FrontUserId, userName: FrontUserName): Promise<boolean>;
}
