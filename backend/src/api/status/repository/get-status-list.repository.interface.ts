import type { StatusMaster } from "../../../infrastructure/db";

/**
 * ステータス一覧取得リポジトリインターフェース
 */
export interface IGetStatusListRepository {
  findAll(): Promise<StatusMaster[]>;
}
