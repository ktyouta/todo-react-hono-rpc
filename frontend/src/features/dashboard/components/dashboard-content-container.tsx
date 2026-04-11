import { useDashboardStats } from '../hooks/use-dashboard-stats';
import { DashboardOtherSection } from './dashboard-other-section';
import { DashboardStatsSection } from './dashboard-stats-section';
import { DashboardTaskSection } from './dashboard-task-section';

export function DashboardContentContainer() {
    const { stats, clickTask } = useDashboardStats();

    return (
        <div className="p-4 sm:p-6 w-full flex flex-col gap-6">
            {/* スケジュール */}
            <DashboardStatsSection
                overdue={stats.overdue}
                dueToday={stats.dueToday}
                dueSoon={stats.dueSoon}
                overdueList={stats.overdueList}
                dueTodayList={stats.dueTodayList}
                dueSoonList={stats.dueSoonList}
                clickTask={clickTask}
            />
            {/* タスク状況 */}
            <DashboardTaskSection
                byStatus={stats.byStatus}
                byPriority={stats.byPriority}
            />
            {/* その他 */}
            <DashboardOtherSection
                favorites={stats.favorites}
                memos={stats.memos}
                trash={stats.trash}
                noDueDate={stats.noDueDate}
                noPriority={stats.noPriority}
                total={stats.total}
            />
        </div>
    );
}
