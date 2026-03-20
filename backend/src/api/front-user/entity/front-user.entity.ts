import {
  FrontUserBirthday,
  FrontUserId,
  FrontUserName,
  RoleId,
} from "../../../domain";

/**
 * フロントユーザーエンティティ
 */
export class FrontUserEntity {
  private readonly _frontUserId: FrontUserId;
  private readonly _frontUserName: FrontUserName;
  private readonly _frontUserBirthday: FrontUserBirthday;
  private readonly _roleId: RoleId;

  constructor(
    userId: FrontUserId,
    userName: FrontUserName,
    userBirthday: FrontUserBirthday,
    roleId: RoleId,
  ) {
    this._frontUserId = userId;
    this._frontUserName = userName;
    this._frontUserBirthday = userBirthday;
    this._roleId = roleId;
  }

  get frontUserId(): number {
    return this._frontUserId.value;
  }

  get frontUserName(): string {
    return this._frontUserName.value;
  }

  get frontUserBirthday(): string {
    return this._frontUserBirthday.value;
  }

  get roleId(): number {
    return this._roleId.value;
  }
}
