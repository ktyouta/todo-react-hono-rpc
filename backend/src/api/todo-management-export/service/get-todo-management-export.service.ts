import { IGetTodoManagementExportRepository, TodoManagementExportItem } from "../repository/get-todo-management-export.repository.interface";
import { GetTodoManagementExportQuerySchemaType } from "../schema/get-todo-management-export-query.schema";

const CSV_HEADERS = ['ID', 'タイトル', '内容', 'カテゴリID', 'カテゴリ', 'ステータスID', 'ステータス', '優先度ID', '優先度', '期日', 'ユーザーID', 'ユーザー名', '作成日時', '更新日時'];

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
        const rows = items.map((item) => [
            item.id.toString(),
            this.escape(item.title),
            this.escape(item.content ?? ''),
            this.escape(item.categoryId),
            this.escape(item.categoryName),
            this.escape(item.statusId),
            this.escape(item.statusName),
            this.escape(item.priorityId),
            this.escape(item.priorityName),
            item.dueDate ?? '',
            item.userId?.toString() ?? '',
            this.escape(item.userName),
            item.createdAt,
            item.updatedAt,
        ].join(','));

        return BOM + [CSV_HEADERS.join(','), ...rows].join('\r\n');
    }

    private escape(value: string): string {
        if (/[,"\r\n]/.test(value)) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }
}
