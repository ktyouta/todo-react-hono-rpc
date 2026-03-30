/**
 * ロール名
 */
export class RoleName {
  private readonly _value: string;

  constructor(value: string) {
    if (value.length < 1 || value.length > 50) {
      throw new Error("ロール名が不正です。");
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }
}
