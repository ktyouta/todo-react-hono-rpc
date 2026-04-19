import { DonutChart } from '@/features/dashboard/components/donut-chart';
import { StatCard } from '@/features/dashboard/components/stat-card';
import { AdminDashboardStatsType } from '../api/get-admin-dashboard-stats';

type PropsType = Pick<AdminDashboardStatsType, 'taskStats'>;

export function AdminDashboardTaskSection({ taskStats }: PropsType) {
    const total = taskStats.byStatus.notStarted + taskStats.byStatus.inProgress + taskStats.byStatus.done;
    const completionRate = total === 0 ? 0 : Math.round((taskStats.byStatus.done / total) * 100);

    return (
        <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3 pl-2 border-l-[3px] border-cyan-400">タスク概況（全ユーザー合計）</h2>
            <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-500 text-center mb-1">ステータス</p>
                        <DonutChart
                            data={[
                                { name: '未着手', color: '#d1d5db', value: taskStats.byStatus.notStarted },
                                { name: '着手中', color: '#22d3ee', value: taskStats.byStatus.inProgress },
                                { name: '完了', color: '#34d399', value: taskStats.byStatus.done },
                            ]}
                        />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-500 text-center mb-1">優先度</p>
                        <DonutChart
                            data={[
                                { name: '高', color: '#f87171', value: taskStats.byPriority.high },
                                { name: '中', color: '#fbbf24', value: taskStats.byPriority.medium },
                                { name: '低', color: '#86efac', value: taskStats.byPriority.low },
                            ]}
                        />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center gap-1">
                        <p className="text-sm text-gray-500">タスク完了率</p>
                        <p className="text-5xl font-bold text-emerald-500">{completionRate}<span className="text-2xl">%</span></p>
                        <p className="text-sm text-gray-400">{taskStats.byStatus.done} / {total} 件</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <StatCard value={taskStats.tasks} label="タスク" />
                    <StatCard value={taskStats.subTasks} label="サブタスク" />
                    <StatCard value={taskStats.memos} label="メモ" />
                    <StatCard value={taskStats.overdue} label="期限切れ" variant="red" />
                    <StatCard value={taskStats.trash} label="ゴミ箱" />
                </div>
            </div>
        </section>
    );
}
