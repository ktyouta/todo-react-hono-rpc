import { FrontUserId } from "../../../domain";
import { IGetTodoExportRepository, TodoExportItem } from "../repository/get-todo-export.repository.interface";
import { GetTodoExportQuerySchemaType } from "../schema/get-todo-export-query.schema";

// CSVヘッダ
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
        const BOM = '\uFEFF';
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
            item.isFavorite ? '1' : '0',
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
