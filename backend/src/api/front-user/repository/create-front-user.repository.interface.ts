import type { FrontUserName } from "../../../domain";
import type { FrontUserMaster } from "../../../infrastructure/db";

/**
 * ユーザー作成リポジトリインターフェース
 */
export interface ICreateFrontUserRepository {
  /**
   * ユーザー名でユーザーを検索
   * @param userName ユーザー名
   */
  findByUserName(userName: FrontUserName): Promise<FrontUserMaster[]>;

  /**
   * ロールIDに紐づくロール名を取得
   * @param roleId ロールID
   */
  findRoleNameById(roleId: number): Promise<string>;

  /**
   * ロールIDに紐づくパーミッション一覧を取得
   * @param roleId ロールID
   */
  findPermissionsByRoleId(roleId: number): Promise<string[]>;
}
