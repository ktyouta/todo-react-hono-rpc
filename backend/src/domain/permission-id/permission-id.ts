/**
 * パーミッションID
 */
export class PermissionId {
  private readonly _value: number;

  constructor(value: number) {
    if (value < 1) {
      throw new Error(`パーミッションIDが不正です。ID:${value}`);
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }
}
