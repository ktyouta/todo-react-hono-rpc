// デフォルトのロール値
const DEFAULT_ROLE_ID = 1;

/**
 * ロールID
 */
export class RoleId {
  private readonly _value: number;

  private constructor(roleId: number) {
    if (!roleId) {
      throw new Error("ロールIDが設定されていません。");
    }
    this._value = roleId;
  }

  get value(): number {
    return this._value;
  }

  /**
   * ファクトリメソッド
   */
  static of(roleId: number): RoleId {
    if (roleId < 1) {
      throw new Error(`ロールIDが不正です。ID:${roleId}`);
    }
    return new RoleId(roleId);
  }

  /**
   * デフォルトロール（一般ユーザー）を生成するファクトリメソッド
   */
  static create(): RoleId {
    return new RoleId(DEFAULT_ROLE_ID);
  }
}
