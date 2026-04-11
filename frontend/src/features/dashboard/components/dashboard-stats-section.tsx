import { WarningCard } from './warning-card';
import { DashboardStatsType } from '../api/get-dashboard-stats';

type PropsType = Pick<DashboardStatsType, 'overdue' | 'dueToday' | 'overdueList' | 'dueTodayList'>;

export function DashboardStatsSection({ overdue, dueToday, overdueList, dueTodayList }: PropsType) {
    return (
        <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3 pl-2 border-l-[3px] border-cyan-400">要注意</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <WarningCard
                    count={overdue}
                    label="期限切れ"
                    list={overdueList}
                    variant="red"
                    colorClass={{
                        card: 'bg-red-50 border-red-200',
                        count: 'text-red-600',
                    }}
                />
                <WarningCard
                    count={dueToday}
                    label="今日が期日"
                    list={dueTodayList}
                    variant="yellow"
                    colorClass={{
                        card: 'bg-yellow-50 border-yellow-200',
                        count: 'text-yellow-600',
                    }}
                />
            </div>
        </section>
    );
}
