import { rpc } from '@/lib/rpc-client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { dashboardKeys } from './query-key';

export const getDashboardStatsEndpoint = rpc.api.v1.todo.stats.$get;

export type DashboardStatsType = InferResponseType<typeof getDashboardStatsEndpoint, 200>['data'];

export function useGetDashboardStats() {

    return useSuspenseQuery({
        queryKey: dashboardKeys.all,
        queryFn: async () => {
            const res = await getDashboardStatsEndpoint();
            if (!res.ok) {
                throw new Error('ダッシュボード統計の取得に失敗しました');
            }
            return res.json();
        },
    });
}
