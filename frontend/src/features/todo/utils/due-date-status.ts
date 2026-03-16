export type DueDateStatus = 'overdue' | 'warning' | 'normal' | 'none';

/**
 * 期限日の状態を返す
 * - overdue: 期限切れ（今日より前）
 * - warning: 期限が近い（今日から3日以内）
 * - normal: 余裕あり
 * - none: 期限日未設定
 */
export function getDueDateStatus(dueDate: string | null | undefined): DueDateStatus {

    if (!dueDate) {
        return 'none';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return 'overdue';
    }

    if (diffDays <= 3) {
        return 'warning';
    }

    return 'normal';
}
