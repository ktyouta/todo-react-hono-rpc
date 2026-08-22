export const NONE_BADGE_COLOR = 'bg-[#b0b4bc] dark:bg-gray-600';

export const STATUS_COLOR_MAP: Record<number, string> = {
    1: 'bg-gray-500 dark:bg-gray-700',    // 未着手
    2: 'bg-blue-500 dark:bg-blue-800',    // 着手中
    3: 'bg-green-600 dark:bg-green-800',  // 完了
};

export const PRIORITY_COLOR_MAP: Record<number, string> = {
    1: 'bg-slate-400 dark:bg-slate-600',   // 低
    2: 'bg-orange-400 dark:bg-orange-700', // 中
    3: 'bg-red-500 dark:bg-red-800',       // 高
};

export const CATEGORY_COLOR_MAP: Record<number, string> = {
    1: 'bg-indigo-500 dark:bg-indigo-800', // タスク
    2: 'bg-teal-500 dark:bg-teal-800',     // メモ
};
