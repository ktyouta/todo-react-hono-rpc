import { AdminDashboardStatsType } from '../api/get-admin-dashboard-stats';
import { AdminWarningCard } from './admin-warning-card';

type PropsType = Pick<AdminDashboardStatsType, 'taskStats' | 'taskDeadlines'>;

export function AdminDashboardDeadlineSection({ taskStats, taskDeadlines }: PropsType) {
    return (
        <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3 pl-2 border-l-[3px] border-cyan-400">期限切れタスク詳細（全ユーザー）</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AdminWarningCard
                    count={taskStats.overdue}
                    label="期限切れ"
                    list={taskDeadlines.overdueList}
                    variant="red"
                    colorClass={{
                        card: 'bg-red-50 border-red-200',
                        count: 'text-red-600',
                    }}
                />
                <AdminWarningCard
                    count={taskDeadlines.dueTodayList.length}
                    label="今日が期日"
                    list={taskDeadlines.dueTodayList}
                    variant="yellow"
                    colorClass={{
                        card: 'bg-yellow-50 border-yellow-200',
                        count: 'text-yellow-600',
                    }}
                />
                <AdminWarningCard
                    count={taskDeadlines.dueSoonList.length}
                    label="今週が期日"
                    list={taskDeadlines.dueSoonList}
                    variant="blue"
                    colorClass={{
                        card: 'bg-blue-50 border-blue-200',
                        count: 'text-blue-600',
                    }}
                />
            </div>
        </section>
    );
}
