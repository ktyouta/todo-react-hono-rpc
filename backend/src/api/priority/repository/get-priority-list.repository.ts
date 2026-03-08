import { asc } from "drizzle-orm";
import type { Database, PriorityMaster } from "../../../infrastructure/db";
import { priorityMaster } from "../../../infrastructure/db";
import type { IGetPriorityListRepository } from "./get-priority-list.repository.interface";

/**
 * 優先度一覧取得リポジトリ実装
 */
export class GetPriorityListRepository implements IGetPriorityListRepository {
  constructor(private readonly db: Database) { }

  async findAll(): Promise<PriorityMaster[]> {
    return await this.db
      .select()
      .from(priorityMaster)
      .orderBy(asc(priorityMaster.sortOrder));
  }
}
