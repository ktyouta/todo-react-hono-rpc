import { TaskItem, TaskListItem, TaskItemVariant } from './task-item';

type PropsType = {
    count: number;
    label: string;
    list: TaskListItem[];
    variant: TaskItemVariant;
    colorClass: { card: string; count: string };
    clickTask: (id: number) => void;
};

export function WarningCard({ count, label, list, variant, colorClass, clickTask }: PropsType) {
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
                            clickTask={clickTask}
                        />
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">該当なし</p>
            )}
        </div>
    );
}
