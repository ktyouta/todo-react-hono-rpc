import { AdminDashboardStatsType } from '../api/get-admin-dashboard-stats';

type PropsType = Pick<AdminDashboardStatsType, 'userTaskStats'>;

export function AdminDashboardUserTaskSection({ userTaskStats }: PropsType) {
    return (
        <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3 pl-2 border-l-[3px] border-cyan-400">ユーザー別タスク状況</h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {userTaskStats.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">データなし</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">ユーザー名</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-500">タスク数</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-500">完了率</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-500">期限切れ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userTaskStats.map((user) => {
                                    const completionRate = user.taskCount === 0
                                        ? 0
                                        : Math.round((user.doneCount / user.taskCount) * 100);
                                    return (
                                        <tr key={user.userId} className="border-b border-gray-100 last:border-0">
                                            <td className="py-3 px-4 font-medium text-gray-800">{user.userName}</td>
                                            <td className="py-3 px-4 text-right text-gray-700">{user.taskCount}</td>
                                            <td className="py-3 px-4 text-right">
                                                <span className={completionRate === 100 ? 'text-emerald-500 font-semibold' : 'text-gray-700'}>
                                                    {completionRate}%
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {user.overdueCount > 0
                                                    ? <span className="text-red-500 font-semibold">{user.overdueCount}</span>
                                                    : <span className="text-gray-400">0</span>
                                                }
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}
