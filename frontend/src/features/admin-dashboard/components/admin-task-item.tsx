import { HiOutlineCalendarDays, HiOutlineUser } from 'react-icons/hi2';

export type AdminTaskListItem = {
    id: number;
    title: string;
    dueDate: string;
    userName: string;
};

export type AdminTaskItemVariant = 'red' | 'yellow' | 'blue';

type PropsType = AdminTaskListItem & { variant: AdminTaskItemVariant };

const variantStyles: Record<AdminTaskItemVariant, { strip: string; border: string; dateBadge: string; idChip: string }> = {
    red: {
        strip: 'bg-red-400',
        border: 'border-red-100 dark:border-red-900/50',
        dateBadge: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
        idChip: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
    },
    yellow: {
        strip: 'bg-amber-400',
        border: 'border-amber-100 dark:border-amber-900/50',
        dateBadge: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
        idChip: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
    },
    blue: {
        strip: 'bg-blue-400',
        border: 'border-blue-100 dark:border-blue-900/50',
        dateBadge: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        idChip: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
    },
};

export function AdminTaskItem({ id, title, dueDate, userName, variant }: PropsType) {
    const variantStyle = variantStyles[variant];
    return (
        <li className={`bg-white dark:bg-gray-800 rounded-md border ${variantStyle.border} shadow-sm overflow-hidden`}>
            <div className="flex">
                <div className={`w-1.5 shrink-0 ${variantStyle.strip}`} />
                <div className="flex-1 p-3">
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-[17px] font-medium text-gray-800 dark:text-gray-100 break-words min-w-0 flex-1">{title}</p>
                        <span className={`text-xs shrink-0 mt-0.5 rounded px-1.5 py-0.5 ${variantStyle.idChip}`}>#{id}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                        <HiOutlineUser className="size-4 text-gray-400 dark:text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{userName || '未割り当て'}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                        <HiOutlineCalendarDays className="size-4 text-gray-400 dark:text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-400 dark:text-gray-500">期限日</span>
                        <span className={`text-sm font-semibold rounded-full px-2 py-0.5 ${variantStyle.dateBadge}`}>{dueDate}</span>
                    </div>
                </div>
            </div>
        </li>
    );
}
