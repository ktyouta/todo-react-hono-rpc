import Papa from "papaparse";
import { IGetTodoManagementExportRepository, TodoManagementExportItem } from "../repository/get-todo-management-export.repository.interface";
import { GetTodoManagementExportQuerySchemaType } from "../schema/get-todo-management-export-query.schema";

const CSV_HEADERS = ['ID', 'タイトル', '内容', 'カテゴリID', 'カテゴリ', 'ステータスID', 'ステータス', '優先度ID', '優先度', '期日', 'ユーザー名', '作成日時', '更新日時'];

/**
 * タスク管理CSVエクスポートサービス（管理者用）
 */
export class GetTodoManagementExportService {
    constructor(private readonly repository: IGetTodoManagementExportRepository) { }

    /**
     * エクスポート対象データをDBから取得する
     */
    async fetchData(query: GetTodoManagementExportQuerySchemaType): Promise<TodoManagementExportItem[]> {
        return this.repository.findAll(query);
    }

    /**
     * タスク一覧をCSV文字列に変換する
     */
    convertToCsv(items: TodoManagementExportItem[]): string {
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
                item.userName,
                item.createdAt,
                item.updatedAt,
            ]),
        });
        return BOM + csv;
    }
}
