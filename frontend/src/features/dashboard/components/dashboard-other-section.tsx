import { StatCard } from './stat-card';

type PropsType = {
    favorites: number;
    memos: number;
    trash: number;
};

export function DashboardOtherSection({ favorites, memos, trash }: PropsType) {
    return (
        <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3 pl-2 border-l-[3px] border-cyan-400">その他</h2>
            <div className="flex flex-col gap-3">
                <StatCard value={favorites} label="お気に入り" />
                <StatCard value={memos} label="メモ" />
                <StatCard value={trash} label="ゴミ箱" />
            </div>
        </section>
    );
}
