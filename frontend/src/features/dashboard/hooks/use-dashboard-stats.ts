import { paths } from '@/config/paths';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useGetDashboardStats } from '../api/get-dashboard-stats';

export function useDashboardStats() {
    // タスク集計データ
    const { data } = useGetDashboardStats();
    // ルーティング用
    const { appNavigate } = useAppNavigation();

    /**
     * タスククリックイベント
     * @param id 
     */
    function clickTask(id: number) {
        appNavigate(paths.todoDetail.getHref(id));
    }

    return {
        stats: data.data,
        clickTask
    };
}
