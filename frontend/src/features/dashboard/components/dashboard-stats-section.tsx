import { HiOutlineCalendarDays } from 'react-icons/hi2';

type TaskListItem = {
    id: number;
    title: string;
    dueDate: string;
};

type Variant = 'red' | 'yellow';

type PropsType = {
    overdue: number;
    dueToday: number;
    overdueList: TaskListItem[];
    dueTodayList: TaskListItem[];
};

const variantStyles: Record<Variant, { strip: string; border: string; date: string }> = {
    red: {
        strip: 'bg-red-400',
        border: 'border-red-100',
        date: 'text-red-500',
    },
    yellow: {
        strip: 'bg-amber-400',
        border: 'border-amber-100',
        date: 'text-amber-500',
    },
};

function TaskItem({ id, title, dueDate, variant }: TaskListItem & { variant: Variant }) {
    const s = variantStyles[variant];
    return (
        <li className={`bg-white rounded-md border ${s.border} overflow-hidden`}>
            <div className="flex">
                <div className={`w-1 shrink-0 ${s.strip}`} />
                <div className="flex-1 p-3">
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-[17px] font-medium text-gray-800 break-words min-w-0 flex-1">{title}</p>
                        <span className="text-xs text-gray-400 shrink-0 mt-1">#{id}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-sm">
                        <HiOutlineCalendarDays className="size-3.5 text-gray-400 shrink-0" />
                        <span className="text-gray-400">期限日</span>
                        <span className={`font-medium ${s.date}`}>{dueDate}</span>
                    </div>
                </div>
            </div>
        </li>
    );
}

function WarningCard({
    count,
    label,
    list,
    variant,
    colorClass,
}: {
    count: number;
    label: string;
    list: TaskListItem[];
    variant: Variant;
    colorClass: { card: string; count: string };
}) {
    return (
        <div className={`border rounded-lg p-4 flex flex-col gap-3 ${colorClass.card}`}>
            <div>
                <p className="text-base text-gray-500">{label}</p>
                <p className={`text-3xl font-bold ${colorClass.count}`}>{count}</p>
            </div>
            {list.length > 0 ? (
                <ul className="flex flex-col gap-2">
                    {list.map((task) => (
                        <TaskItem
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            dueDate={task.dueDate}
                            variant={variant}
                        />
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">該当なし</p>
            )}
        </div>
    );
}

export function DashboardStatsSection({ overdue, dueToday, overdueList, dueTodayList }: PropsType) {
    return (
        <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3 pl-2 border-l-[3px] border-cyan-400">要注意</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <WarningCard
                    count={overdue}
                    label="期限切れ"
                    list={overdueList}
                    variant="red"
                    colorClass={{
                        card: 'bg-red-50 border-red-200',
                        count: 'text-red-600',
                    }}
                />
                <WarningCard
                    count={dueToday}
                    label="今日が期日"
                    list={dueTodayList}
                    variant="yellow"
                    colorClass={{
                        card: 'bg-yellow-50 border-yellow-200',
                        count: 'text-yellow-600',
                    }}
                />
            </div>
        </section>
    );
}
