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
                    <p className="text-sm text-gray-500 text-center mb-1">ステータス</p>
                    <StatusDonutChart {...byStatus} />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-500 text-center mb-1">優先度</p>
                    <PriorityDonutChart {...byPriority} />
                </div>
            </div>
        </section>
    );
}
