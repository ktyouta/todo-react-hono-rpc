import { StatCard } from '@/features/dashboard/components/stat-card';
import { AdminDashboardStatsType } from '../api/get-admin-dashboard-stats';

type PropsType = Pick<AdminDashboardStatsType, 'userStats' | 'userByRole'>;

export function AdminDashboardUserSection({ userStats, userByRole }: PropsType) {
    return (
        <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3 pl-2 border-l-[3px] border-cyan-400">ユーザー概況</h2>
            <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <StatCard value={userStats.total} label="総ユーザー数" />
                    <StatCard value={userStats.active} label="アクティブ" />
                    <StatCard value={userStats.deleted} label="削除済み" />
                    {userByRole.map((role) => (
                        <StatCard key={role.roleId} value={role.count} label={role.roleName} />
                    ))}
                    <StatCard value={userStats.longInactive} label="長期未ログイン（30日以上）" variant="yellow" />
                </div>
            </div>
        </section>
    );
}
