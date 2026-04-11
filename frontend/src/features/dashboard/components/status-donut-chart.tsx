import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

type PropsType = {
    notStarted: number;
    inProgress: number;
    done: number;
};

const STATUS_ITEMS = [
    { name: '未着手', color: '#d1d5db' },
    { name: '着手中', color: '#22d3ee' },
    { name: '完了',   color: '#34d399' },
] as const;

export function StatusDonutChart({ notStarted, inProgress, done }: PropsType) {
    const counts = [notStarted, inProgress, done];
    const total = counts.reduce((sum, v) => sum + v, 0);

    const data = STATUS_ITEMS.map((item, i) => ({ ...item, value: counts[i] }));

    const chartData = total === 0
        ? [{ name: 'データなし', color: '#e5e7eb', value: 1 }]
        : data;

    return (
        <div className="flex flex-col items-center gap-3">
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={72}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        strokeWidth={0}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                        <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-500">{item.name}</span>
                        <span className="font-medium text-gray-700">{item.value}件</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
