import { AdminTaskItem, AdminTaskItemVariant, AdminTaskListItem } from './admin-task-item';

type PropsType = {
    count: number;
    label: string;
    list: AdminTaskListItem[];
    variant: AdminTaskItemVariant;
    colorClass: { card: string; count: string };
};

export function AdminWarningCard({ count, label, list, variant, colorClass }: PropsType) {
    return (
        <div className={`border rounded-lg p-4 flex flex-col gap-3 ${colorClass.card}`}>
            <div>
                <p className="text-base text-gray-500">{label}</p>
                <p className={`text-3xl font-bold ${colorClass.count}`}>{count}</p>
            </div>
            {list.length > 0 ? (
                <ul className="flex flex-col gap-2">
                    {list.map((task) => (
                        <AdminTaskItem
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            dueDate={task.dueDate}
                            userName={task.userName}
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
