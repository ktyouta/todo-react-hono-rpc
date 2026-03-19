import type { FrontUserId, FrontUserName } from "../../../domain";
import type {
  FrontUserLoginMaster,
} from "../../../infrastructure/db";

/**
 * ユーザー情報（ロール付き）
 */
export type UserWithRole = {
  id: number;
  name: string;
  birthday: string;
  roleId: number;
  role: string;
};

/**
 * ログインリポジトリインターフェース
 */
export interface IFrontUserLoginRepository {
  /**
   * ユーザー名でログイン情報を取得
   * @param userName ユーザー名
   */
  getLoginUser(userName: FrontUserName): Promise<FrontUserLoginMaster | undefined>;

  /**
   * ユーザーIDでユーザー情報を取得
   * @param userId ユーザーID
   */
  getUserInfo(userId: FrontUserId): Promise<UserWithRole | undefined>;

  /**
   * ロールIDに紐づくパーミッション（screen）一覧を取得
   * @param roleId ロールID
   */
  getPermissionsByRoleId(roleId: number): Promise<string[]>;

  /**
   * 最終ログイン日時を更新
   * @param userId ユーザーID
   */
  updateLastLoginDate(userId: FrontUserId): Promise<void>;
}
