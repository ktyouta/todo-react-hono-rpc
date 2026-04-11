import { PriorityDonutChart } from './priority-donut-chart';
import { StatusDonutChart } from './status-donut-chart';

type PropsType = {
    byStatus: { notStarted: number; inProgress: number; done: number };
    byPriority: { high: number; medium: number; low: number };
};

export function DashboardTaskSection({ byStatus, byPriority }: PropsType) {
    return (
        <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3 pl-2 border-l-[3px] border-cyan-400">タスク状況</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-base text-gray-500 text-center mb-1">ステータス</p>
                    <StatusDonutChart
                        data={[
                            { name: '未着手', color: '#d1d5db', value: byStatus.notStarted },
                            { name: '着手中', color: '#22d3ee', value: byStatus.inProgress },
                            { name: '完了',   color: '#34d399', value: byStatus.done },
                        ]}
                    />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-base text-gray-500 text-center mb-1">優先度</p>
                    <PriorityDonutChart
                        data={[
                            { name: '高', color: '#f87171', value: byPriority.high },
                            { name: '中', color: '#fbbf24', value: byPriority.medium },
                            { name: '低', color: '#86efac', value: byPriority.low },
                        ]}
                    />
                </div>
            </div>
        </section>
    );
}
