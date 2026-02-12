import type { FrontUserId, FrontUserName, FrontUserPassword } from "../../../domain";
import type {
  FrontUserLoginMaster,
  FrontUserMaster,
} from "../../../infrastructure/db";
import type { IFrontUserLoginRepository } from "../repository";

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
  async getUserInfo(userId: FrontUserId): Promise<FrontUserMaster | undefined> {
    return await this.repository.getUserInfo(userId);
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
