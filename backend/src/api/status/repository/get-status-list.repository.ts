import { asc } from "drizzle-orm";
import type { Database, StatusMaster } from "../../../infrastructure/db";
import { statusMaster } from "../../../infrastructure/db";
import type { IGetStatusListRepository } from "./get-status-list.repository.interface";

/**
 * ステータス一覧取得リポジトリ実装
 */
export class GetStatusListRepository implements IGetStatusListRepository {
  constructor(private readonly db: Database) {}

  async findAll(): Promise<StatusMaster[]> {
    return await this.db
      .select()
      .from(statusMaster)
      .orderBy(asc(statusMaster.sortOrder));
  }
}
