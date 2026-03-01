import { asc } from "drizzle-orm";
import type { CategoryMaster, Database } from "../../../infrastructure/db";
import { categoryMaster } from "../../../infrastructure/db";
import type { IGetCategoryListRepository } from "./get-category-list.repository.interface";

/**
 * カテゴリ一覧取得リポジトリ実装
 */
export class GetCategoryListRepository implements IGetCategoryListRepository {
  constructor(private readonly db: Database) {}

  async findAll(): Promise<CategoryMaster[]> {
    return await this.db
      .select()
      .from(categoryMaster)
      .orderBy(asc(categoryMaster.sortOrder));
  }
}
