import Papa from "papaparse";
import { FrontUserId } from "../../../domain";
import { IGetTodoExportRepository, TodoExportItem } from "../repository/get-todo-export.repository.interface";
import { GetTodoExportQuerySchemaType } from "../schema/get-todo-export-query.schema";

const CSV_HEADERS = ['ID', 'タイトル', '内容', 'カテゴリID', 'カテゴリ', 'ステータスID', 'ステータス', '優先度ID', '優先度', '期日', 'お気に入り', '作成日時', '更新日時'];

/**
 * タスクCSVエクスポートサービス
 */
export class GetTodoExportService {
    constructor(private readonly repository: IGetTodoExportRepository) { }

    /**
     * エクスポート対象データをDBから取得する
     */
    async fetchData(userId: FrontUserId, query: GetTodoExportQuerySchemaType): Promise<TodoExportItem[]> {
        return this.repository.findAll(userId, query);
    }

    /**
     * タスク一覧をCSV文字列に変換する
     */
    convertToCsv(items: TodoExportItem[]): string {
        const BOM = '﻿';
        const csv = Papa.unparse({
            fields: CSV_HEADERS,
            data: items.map((item) => [
                item.id.toString(),
                item.title,
                item.content ?? '',
                item.categoryId,
                item.categoryName,
                item.statusId,
                item.statusName,
                item.priorityId,
                item.priorityName,
                item.dueDate ?? '',
                item.isFavorite ? '1' : '0',
                item.createdAt,
                item.updatedAt,
            ]),
        });
        return BOM + csv;
    }
}
