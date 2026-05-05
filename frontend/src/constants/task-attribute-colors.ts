export const STATUS_COLOR_MAP: Record<number, string> = {
    1: 'bg-gray-500',   // 未着手
    2: 'bg-blue-500',   // 着手中
    3: 'bg-green-600',  // 完了
};

export const PRIORITY_COLOR_MAP: Record<number, string> = {
    1: 'bg-slate-400',  // 低
    2: 'bg-orange-400', // 中
    3: 'bg-red-500',    // 高
};

export const CATEGORY_COLOR_MAP: Record<number, string> = {
    1: 'bg-indigo-500', // タスク
    2: 'bg-teal-500',   // メモ
};
