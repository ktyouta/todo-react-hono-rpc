import { AdminDashboardStatsType } from '../api/get-admin-dashboard-stats';

type PropsType = {
    entry: AdminDashboardStatsType['userTaskStats'][number];
};

export function AdminDashboardUserTaskCard({ entry }: PropsType) {
    const rate = entry.taskCount === 0 ? 0 : Math.round((entry.doneCount / entry.taskCount) * 100);

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-[17px] font-medium text-gray-800">{entry.userName}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 pt-3 border-t border-gray-100 text-xs">
                <div>
                    <span className="text-gray-400">タスク数</span>
                    <span className="ml-1.5 text-gray-600">{entry.taskCount}</span>
                </div>
                <div>
                    <span className="text-gray-400">完了率</span>
                    <span className={`ml-1.5 ${rate === 100 ? 'text-emerald-500 font-semibold' : 'text-gray-600'}`}>
                        {rate}%
                    </span>
                </div>
                <div>
                    <span className="text-gray-400">期限切れ</span>
                    <span className={`ml-1.5 ${entry.overdueCount > 0 ? 'text-red-500 font-semibold' : 'text-gray-600'}`}>
                        {entry.overdueCount}
                    </span>
                </div>
            </div>
        </div>
    );
}
