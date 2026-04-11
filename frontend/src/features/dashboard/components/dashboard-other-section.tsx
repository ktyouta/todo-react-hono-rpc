import { StatCard } from './stat-card';

type PropsType = {
    favorites: number;
    memos: number;
    trash: number;
    noDueDate: number;
    noPriority: number;
    total: number;
};

export function DashboardOtherSection({ favorites, memos, trash, noDueDate, noPriority, total }: PropsType) {
    return (
        <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3 pl-2 border-l-[3px] border-cyan-400">その他</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard value={total} label="総数" />
                <StatCard value={favorites} label="お気に入り" />
                <StatCard value={memos} label="メモ" />
                <StatCard value={trash} label="ゴミ箱" />
                <StatCard value={noDueDate} label="期限未設定" />
                <StatCard value={noPriority} label="優先度未設定" />
            </div>
        </section>
    );
}
