/**
 * 日付文字列を YYYY-MM-DD 形式に正規化する
 * YYYY-MM-DD および Excel が出力する YYYY/M/D 形式を受け付ける
 * @returns 正規化後の文字列、解析できない場合は null
 */
export function parseDueDate(value: string): string | null {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const match = value.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (match) {
    const [, year, month, day] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return null;
}
