import type { CategoryMaster } from "../../../infrastructure/db";

/**
 * カテゴリ一覧取得リポジトリインターフェース
 */
export interface IGetCategoryListRepository {
  findAll(): Promise<CategoryMaster[]>;
}
