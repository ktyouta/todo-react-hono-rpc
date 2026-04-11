import { useDashboardStats } from '../hooks/use-dashboard-stats';
import { DashboardOtherSection } from './dashboard-other-section';
import { DashboardStatsSection } from './dashboard-stats-section';
import { DashboardTaskSection } from './dashboard-task-section';

export function DashboardContentContainer() {
    const { stats } = useDashboardStats();

    return (
        <div className="p-4 sm:p-6 w-full flex flex-col gap-6">
            {/* 要注意（全幅） */}
            <DashboardStatsSection
                overdue={stats.overdue}
                dueToday={stats.dueToday}
                overdueList={stats.overdueList}
                dueTodayList={stats.dueTodayList}
            />
            {/* タスク状況（左）＋その他（右） */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:flex-1">
                    <DashboardTaskSection
                        byStatus={stats.byStatus}
                        byPriority={stats.byPriority}
                    />
                </div>
                <div className="md:w-48">
                    <DashboardOtherSection
                        favorites={stats.favorites}
                        memos={stats.memos}
                        trash={stats.trash}
                    />
                </div>
            </div>
        </div>
    );
}
