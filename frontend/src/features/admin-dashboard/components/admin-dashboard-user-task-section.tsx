import { Table } from '@/components';
import type { TableProps } from '@/components/ui/table/table';
import { AdminDashboardStatsType } from '../api/get-admin-dashboard-stats';
import { AdminDashboardUserTaskCard } from './admin-dashboard-user-task-card';

type UserTaskStatRow = AdminDashboardStatsType['userTaskStats'][number] & { id: number };

const columns: TableProps<UserTaskStatRow>['columns'] = [
    {
        title: 'ユーザー名',
        field: 'userName',
        className: 'pl-4',
    },
    {
        title: 'タスク数',
        field: 'taskCount',
        className: 'w-[15%] whitespace-nowrap',
        Cell: ({ entry }) => <span className="block">{entry.taskCount}</span>,
    },
    {
        title: '完了率',
        field: 'doneCount',
        className: 'w-[15%] whitespace-nowrap',
        Cell: ({ entry }) => {
            const rate = entry.taskCount === 0 ? 0 : Math.round((entry.doneCount / entry.taskCount) * 100);
            return (
                <span className={`block ${rate === 100 ? 'text-emerald-500 font-semibold' : 'text-gray-700'}`}>
                    {rate}%
                </span>
            );
        },
    },
    {
        title: '期限切れ',
        field: 'overdueCount',
        className: 'w-[15%] whitespace-nowrap pr-4',
        Cell: ({ entry }) => {
            const overCountStyle = entry.overdueCount > 0 ? "text-red-500 font-semibold" : "";
            return (
                <span className={`block ${overCountStyle}`}> {entry.overdueCount}</span >
            );
        }
    },
];

type PropsType = Pick<AdminDashboardStatsType, 'userTaskStats'>;

export function AdminDashboardUserTaskSection({ userTaskStats }: PropsType) {
    const tableData: UserTaskStatRow[] = userTaskStats.map((u) => ({ ...u, id: u.userId }));

    return (
        <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3 pl-2 border-l-[3px] border-cyan-400">ユーザー別タスク状況</h2>
            {/* テーブル表示: lg 以上 */}
            <div className="hidden lg:block border border-gray-300/90 rounded-md overflow-hidden">
                <Table
                    data={tableData}
                    columns={columns}
                    className="text-[17px] min-w-[700px]
                        [&_thead]:bg-gray-200/70
                        [&_thead_tr]:border-b
                        [&_thead_tr]:border-gray-400/60
                        [&_thead_tr]:hover:bg-transparent"
                    rowClassName="h-[50px] border-gray-300/80 bg-white/50"
                />
            </div>
            {/* カード表示: lg 未満 */}
            <div className="lg:hidden flex flex-col gap-2">
                {userTaskStats.map((entry) => (
                    <AdminDashboardUserTaskCard key={entry.userId} entry={entry} />
                ))}
            </div>
        </section>
    );
}
