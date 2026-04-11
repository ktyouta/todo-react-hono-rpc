import { useSuspenseQuery } from '@tanstack/react-query';
import { getDashboardStatsEndpoint } from '../api/get-dashboard-stats';

export function useDashboardStats() {
    const { data } = useSuspenseQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const res = await getDashboardStatsEndpoint();
            if (!res.ok) {
                throw new Error('ダッシュボード統計の取得に失敗しました');
            }
            return res.json();
        },
    });

    return { stats: data.data };
}
