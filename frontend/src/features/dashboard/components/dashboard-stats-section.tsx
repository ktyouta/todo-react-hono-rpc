import { DashboardStatsType } from '../api/get-dashboard-stats';
import { WarningCard } from './warning-card';

type PropsType = Pick<DashboardStatsType, 'overdue' | 'dueToday' | 'dueSoon' | 'overdueList' | 'dueTodayList' | 'dueSoonList'> & {
    clickTask: (id: number) => void;
}

export function DashboardStatsSection({ overdue, dueToday, dueSoon, overdueList, dueTodayList, dueSoonList, clickTask }: PropsType) {
    return (
        <section>
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 pl-2 border-l-[3px] border-cyan-400">スケジュール</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <WarningCard
                    count={overdue}
                    label="期限切れ"
                    list={overdueList}
                    variant="red"
                    colorClass={{
                        card: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
                        count: 'text-red-600 dark:text-red-400',
                    }}
                    clickTask={clickTask}
                />
                <WarningCard
                    count={dueToday}
                    label="今日が期日"
                    list={dueTodayList}
                    variant="yellow"
                    colorClass={{
                        card: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
                        count: 'text-yellow-600 dark:text-yellow-400',
                    }}
                    clickTask={clickTask}
                />
                <WarningCard
                    count={dueSoon}
                    label="今週が期日"
                    list={dueSoonList}
                    variant="blue"
                    colorClass={{
                        card: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
                        count: 'text-blue-600 dark:text-blue-400',
                    }}
                    clickTask={clickTask}
                />
            </div>
        </section>
    );
}
