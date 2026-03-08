import type { PriorityMaster } from "../../../infrastructure/db";

/**
 * 優先度一覧取得リポジトリインターフェース
 */
export interface IGetPriorityListRepository {
  findAll(): Promise<PriorityMaster[]>;
}
