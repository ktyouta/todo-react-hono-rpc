import Papa from "papaparse";
import { CategoryType } from "../../../domain";

const MAX_ROWS = 200;
const CSV_COLUMN_COUNT = 13;

// カラムインデックス
const COL = {
  ID: 0,
  TITLE: 1,
  CONTENT: 2,
  CATEGORY_ID: 3,
  STATUS_ID: 5,
  PRIORITY_ID: 7,
  DUE_DATE: 9,
  IS_FAVORITE: 10,
} as const;

export type ValidatedRow = {
  rowNumber: number;
  id: number;
  title: string;
  content: string | null;
  categoryId: number;
  statusId: number | null;
  priorityId: number | null;
  dueDate: string | null;
  isFavorite: boolean;
};

export type RowError = {
  row: number;
  id: number | null;
  message: string;
};


/**
 * タスクCSVインポートサービス
 */
export class ImportTodoService {

  /**
   * CSV行に変換
   * @param csvText 
   * @returns 
   */
  toCsvRows(csvText: string) {
    const result = Papa.parse<string[]>(csvText.replace(/^﻿/, ""), {
      skipEmptyLines: true,
    });

    // ヘッダー行（1行目）を読み飛ばす
    return result.data.slice(1);
  }

  /**
   * 行数チェック
   * @param csvRows 
   * @returns 
   */
  isOverMaxRows(csvRows: string[][]) {
    return csvRows.length > MAX_ROWS;
  }

  /**
   * CSVテキストをパース・バリデーション
   */
  parse(csvRows: string[][]) {

    // 重複IDを検出
    const duplicateIdList = new Map<number, number[]>();
    const parsedRows: Array<{ row: number; columns: string[]; rawId: number | null }> = [];

    for (let i = 0; i < csvRows.length; i++) {
      // ヘッダーが1行目なのでデータは2行目から
      const rowNumber = i + 2;
      const columns = csvRows[i];
      const rawId = this.parsePositiveInt(columns[COL.ID]);

      parsedRows.push({ row: rowNumber, columns, rawId });

      if (rawId) {
        const existNumberList = duplicateIdList.get(rawId) ?? [];
        existNumberList.push(rowNumber);
        duplicateIdList.set(rawId, existNumberList);
      }
    }

    // 重複しているIDの行番号セットを作成
    const duplicateRows = new Set<number>();
    for (const [, rows] of duplicateIdList) {
      if (rows.length > 1) {
        rows.forEach((r) => {
          duplicateRows.add(r)
        });
      }
    }

    const validRows: ValidatedRow[] = [];
    const errors: RowError[] = [];

    for (const { row, columns, rawId } of parsedRows) {

      // ID欠落エラー
      if (!rawId) {
        errors.push({ row, id: rawId, message: "IDが入力されていません" });
        continue;
      }

      // 重複IDエラー
      if (duplicateRows.has(row)) {
        errors.push({ row, id: rawId, message: "IDが重複しています" });
        continue;
      }

      // バリデーションチェック
      const result = this.validateRow(row, columns, rawId);
      // エラー
      if (typeof result === 'string') {
        errors.push({
          row,
          id: null,
          message: result
        });
        continue;
      }

      validRows.push(result);
    }

    return { validRows, errors };
  }

  /**
   * 行単位のバリデーション
   * @param row 
   * @param columns 
   * @param rawId 
   * @returns 
   */
  private validateRow(
    row: number,
    columns: string[],
    rawId: number,
  ) {

    if (columns.length < CSV_COLUMN_COUNT) {
      return "カラム数が不正です";
    }

    // ID
    if (!rawId) {
      return "IDが不正です";
    }

    // タイトル
    const title = columns[COL.TITLE].trim();
    if (title.length === 0) {
      return "タイトルを入力してください";
    }
    if (title.length > 200) {
      return "タイトルは200文字以内で入力してください";
    }

    // 内容（空はnull）
    const rawContent = columns[COL.CONTENT].trim();
    const content = rawContent.length > 0 ? rawContent : null;
    if (content !== null && content.length > 2000) {
      return "内容は2000文字以内で入力してください";
    }

    // カテゴリID
    const categoryId = this.parsePositiveInt(columns[COL.CATEGORY_ID]);
    if (categoryId === null || !Object.values(CategoryType).includes(categoryId)) {
      return `カテゴリIDが不正です（使用可能な値: ${Object.values(CategoryType).join(", ")}）`;
    }

    // ステータスID（空はnull）
    const rawStatusId = columns[COL.STATUS_ID].trim();
    const statusId = rawStatusId === "" ? null : this.parsePositiveInt(rawStatusId);
    if (rawStatusId !== "" && statusId === null) {
      return "ステータスIDが不正です";
    }

    // 優先度ID（空はnull）
    const rawPriorityId = columns[COL.PRIORITY_ID].trim();
    const priorityId = rawPriorityId === "" ? null : this.parsePositiveInt(rawPriorityId);
    if (rawPriorityId !== "" && priorityId === null) {
      return "優先度IDが不正です";
    }

    // 期日（空はnull）
    const rawDueDate = columns[COL.DUE_DATE].trim();
    const dueDate = rawDueDate === "" ? null : rawDueDate;
    if (dueDate !== null && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      return "期日はYYYY-MM-DD形式で入力してください";
    }

    // お気に入り
    const rawFavorite = columns[COL.IS_FAVORITE].trim();
    if (rawFavorite !== "0" && rawFavorite !== "1") {
      return "お気に入りは0または1で入力してください";
    }

    const isFavorite = rawFavorite === "1";

    // カテゴリがメモの場合はstatusId/priorityIdをnullにクリア
    const isMemo = categoryId === CategoryType.memo;

    return {
      rowNumber: row,
      id: rawId,
      title,
      content,
      categoryId,
      statusId: isMemo ? null : statusId,
      priorityId: isMemo ? null : priorityId,
      dueDate,
      isFavorite,
    };
  }


  /**
   * 文字列を正の整数に変換する（変換できない場合はnull）
   */
  private parsePositiveInt(value: string | undefined) {

    if (!value?.trim()) {
      return null
    }

    const n = Number(value.trim());

    if (!Number.isInteger(n) || n <= 0) {
      return null
    }

    return n;
  }
}
