import type { FrontUserId, FrontUserName, FrontUserPassword } from "../../../domain";
import type {
  FrontUserLoginMaster,
} from "../../../infrastructure/db";
import type { IFrontUserLoginRepository, UserWithRole } from "../repository/front-user-login.repository.interface";

/**
 * ログインサービス
 */
export class FrontUserLoginService {
  constructor(private readonly repository: IFrontUserLoginRepository) { }

  /**
   * ログイン情報を取得
   */
  async getLoginUser(
    userName: FrontUserName
  ): Promise<FrontUserLoginMaster | undefined> {
    return await this.repository.getLoginUser(userName);
  }

  /**
   * ユーザー情報を取得
   */
  async getUserInfo(userId: FrontUserId): Promise<UserWithRole | undefined> {
    return await this.repository.getUserInfo(userId);
  }

  /**
   * ロールIDに紐づくパーミッション一覧を取得
   */
  async getPermissions(roleId: number): Promise<string[]> {
    return await this.repository.getPermissionsByRoleId(roleId);
  }

  /**
   * 最終ログイン日時を更新
   */
  async updateLastLoginDate(userId: FrontUserId): Promise<void> {
    await this.repository.updateLastLoginDate(userId);
  }

  /**
   * パスワードチェック
   * @param password
   * @param loginInfo
   */
  isMatchPassword(password: FrontUserPassword, loginInfo: FrontUserLoginMaster) {

    const encoder = new TextEncoder();
    const encodedInputPassword = encoder.encode(password.value);
    const encodedPassword = encoder.encode(loginInfo.password);

    if (encodedInputPassword.length !== encodedPassword.length) {
      return false;
    }

    if (!crypto.subtle.timingSafeEqual(encodedInputPassword, encodedPassword)) {
      return false;
    }

    return true;
  }
}
