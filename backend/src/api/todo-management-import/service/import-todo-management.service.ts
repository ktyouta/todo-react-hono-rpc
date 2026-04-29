import Papa from "papaparse";
import { CategoryType, StatusType } from "../../../domain";
import { PriorityType } from "../../../domain/task-priority";
import { IImportTodoManagementRepository, TaskResult } from "../repository/import-todo-management.repository.interface";

const MIN_ROWS = 1;
const MAX_ROWS = 200;
// 管理エクスポートCSVは13列（通常の13列 - isFavorite + ユーザー名）
const CSV_COLUMN_COUNT = 13;
const CSV_START_ROWS = 2;

// カラムインデックス（管理エクスポートCSVの列定義に準拠）
const COL = {
  ID: 0,
  TITLE: 1,
  CONTENT: 2,
  CATEGORY_ID: 3,
  STATUS_ID: 5,
  PRIORITY_ID: 7,
  DUE_DATE: 9,
} as const;

export type ValidatedManagementRow = {
  rowNumber: number;
  id: number;
  title: string;
  content: string;
  categoryId: number;
  statusId: number | null;
  priorityId: number | null;
  dueDate: string | null;
};

export type RowError = {
  rowNumber: number;
  id: number | null;
  message: string;
};

/**
 * タスク管理CSVインポートサービス（管理者用）
 */
export class ImportTodoManagementService {

  constructor(private readonly repository: IImportTodoManagementRepository) { }

  /**
   * CSV行に変換
   */
  toCsvRows(csvText: string) {
    const result = Papa.parse<string[]>(csvText.replace(/^﻿/, ""), {
      skipEmptyLines: true,
    });

    // ヘッダー行（1行目）を読み飛ばす
    return result.data.slice(1);
  }

  /**
   * 行数不足チェック
   */
  isShortageRows(csvRows: string[][]) {
    return csvRows.length < MIN_ROWS;
  }

  /**
   * 最大行数チェック
   */
  isOverMaxRows(csvRows: string[][]) {
    return csvRows.length > MAX_ROWS;
  }

  /**
   * CSVから更新・エラー対象を取得する
   */
  getValidateResult(csvRows: string[][]) {

    const validRows: ValidatedManagementRow[] = [];
    const errors: RowError[] = [];
    const idCounts = new Map<number, number>();

    // IDの重複行を取得
    csvRows.forEach((columns) => {
      const id = this.parsePositiveInt(columns[COL.ID]);
      if (id) {
        idCounts.set(id, (idCounts.get(id) ?? 0) + 1)
      }
    });

    // 更新・エラー対象を取得
    csvRows.forEach((columns, index) => {

      // ヘッダーが1行目なのでデータは2行目から
      const rowNumber = index + CSV_START_ROWS;
      const rawId = columns[COL.ID];
      const id = this.parsePositiveInt(rawId);

      // IDが欠落
      if (!id) {
        errors.push({
          rowNumber,
          id,
          message: "IDが入力されていません"
        });
        return;
      }

      // ID重複チェック
      const duplicateId = idCounts.get(id);
      if (duplicateId && duplicateId > 1) {
        errors.push({
          rowNumber,
          id,
          message: "IDが重複しています"
        });
        return;
      }

      // バリデーションチェック
      const result = this.validateRow(rowNumber, columns, id);
      // エラー
      if (typeof result === 'string') {
        errors.push({
          rowNumber,
          id,
          message: result
        });
        return;
      }

      validRows.push(result);
    });

    return { validRows, errors };
  }

  /**
   * 行単位のバリデーション
   */
  private validateRow(
    rowNumber: number,
    columns: string[],
    id: number,
  ) {

    if (columns.length < CSV_COLUMN_COUNT) {
      return "カラム数が不正です";
    }

    // タイトル
    const title = columns[COL.TITLE]?.trim();
    if (title.length === 0) {
      return "タイトルを入力してください";
    }
    if (title.length > 200) {
      return "タイトルは200文字以内で入力してください";
    }

    // 内容
    const rawContent = columns[COL.CONTENT]?.trim();
    if (!rawContent) {
      return "内容を入力してください"
    }
    if (rawContent.length > 2000) {
      return "内容は2000文字以内で入力してください";
    }

    // カテゴリID
    const categoryId = this.parsePositiveInt(columns[COL.CATEGORY_ID]);
    if (!categoryId || !Object.values(CategoryType).includes(categoryId)) {
      return `カテゴリIDが不正です（使用可能な値: ${Object.values(CategoryType).filter((v): v is number => typeof v === 'number').join(", ")}）`;
    }

    // ステータスID
    const statusId = this.parsePositiveInt(columns[COL.STATUS_ID]?.trim());
    if (statusId && !Object.values(StatusType).includes(statusId)) {
      return `ステータスIDが不正です（使用可能な値: 空欄,${Object.values(StatusType).filter((v): v is number => typeof v === 'number').join(", ")}）`;
    }

    // 優先度ID
    const priorityId = this.parsePositiveInt(columns[COL.PRIORITY_ID]?.trim());
    if (priorityId && !Object.values(PriorityType).includes(priorityId)) {
      return `優先度IDが不正です（使用可能な値: 空欄,${Object.values(PriorityType).filter((v): v is number => typeof v === 'number').join(", ")}）`;
    }

    // 期日
    const dueDate = columns[COL.DUE_DATE].trim();
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      return "期日はYYYY-MM-DD形式で入力してください";
    }

    // カテゴリがメモの場合はstatusId/priorityIdをnullにクリア
    const isMemo = categoryId === CategoryType.memo;

    return {
      rowNumber,
      id,
      title,
      content: rawContent,
      categoryId,
      statusId: isMemo ? null : statusId,
      priorityId: isMemo ? null : priorityId,
      dueDate: dueDate || null,
    };
  }

  /**
   * 文字列を正の整数に変換する（変換できない場合はnull）
   */
  private parsePositiveInt(value: string | undefined) {

    if (!value?.trim()) {
      return null
    }

    const num = Number(value.trim());

    if (!Number.isInteger(num) || num <= 0) {
      return null
    }

    return num
  }

  /**
   * タスク一覧を取得（ユーザーID不問）
   */
  async findTasks(validRows: ValidatedManagementRow[]) {
    return await this.repository.findTasks(validRows.map((e) => e.id));
  }

  /**
   * タスク一覧を元に更新対象を取得する
   */
  getTargetRows(parseResult: ReturnType<typeof this.getValidateResult>, tasks: TaskResult[]) {

    const errors = [...parseResult.errors];
    const taskIds = new Set(tasks.map((e) => e.id));

    // テーブルに含まれないタスクを取得
    const validRows = parseResult.validRows.filter((e) => {
      if (!taskIds.has(e.id)) {
        errors.push({
          rowNumber: e.rowNumber,
          id: e.id,
          message: "該当するタスクが見つかりません"
        });
        return false;
      }
      return true;
    });

    return { validRows, errors };
  }

  /**
   * タスクを一括更新する
   */
  async bulkUpdateTask(validRows: ValidatedManagementRow[]) {
    const now = new Date().toISOString();
    await this.repository.bulkUpdate(validRows, now);
  }
}
