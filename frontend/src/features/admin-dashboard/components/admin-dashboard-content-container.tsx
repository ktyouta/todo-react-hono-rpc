import { useAdminDashboardStats } from '../hooks/use-admin-dashboard-stats';
import { AdminDashboardDeadlineSection } from './admin-dashboard-deadline-section';
import { AdminDashboardSystemSection } from './admin-dashboard-system-section';
import { AdminDashboardTaskSection } from './admin-dashboard-task-section';
import { AdminDashboardUserSection } from './admin-dashboard-user-section';
import { AdminDashboardUserTaskSection } from './admin-dashboard-user-task-section';

export function AdminDashboardContentContainer() {
    const { stats } = useAdminDashboardStats();

    return (
        <div className="p-4 sm:p-6 w-full flex flex-col gap-6">
            {/* ユーザー概況 */}
            <AdminDashboardUserSection
                userStats={stats.userStats}
                userByRole={stats.userByRole}
            />
            {/* タスク概況 */}
            <AdminDashboardTaskSection
                taskStats={stats.taskStats}
            />
            {/* 期限切れタスク詳細 */}
            <AdminDashboardDeadlineSection
                taskStats={stats.taskStats}
                taskDeadlines={stats.taskDeadlines}
            />
            {/* ユーザー別タスク状況 */}
            <AdminDashboardUserTaskSection
                userTaskStats={stats.userTaskStats}
            />
            {/* システム状態 */}
            <AdminDashboardSystemSection
                systemStats={stats.systemStats}
            />
        </div>
    );
}
