import { StatCard } from '@/features/dashboard/components/stat-card';
import { AdminDashboardStatsType } from '../api/get-admin-dashboard-stats';

type PropsType = Pick<AdminDashboardStatsType, 'systemStats'>;

export function AdminDashboardSystemSection({ systemStats }: PropsType) {
    return (
        <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3 pl-2 border-l-[3px] border-cyan-400">システム状態</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard value={systemStats.roleCount} label="ロール数" />
                <StatCard value={systemStats.permissionCount} label="パーミッション数" />
            </div>
        </section>
    );
}
