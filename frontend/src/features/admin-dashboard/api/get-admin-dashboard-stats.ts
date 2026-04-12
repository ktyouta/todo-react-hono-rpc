import { rpc } from '@/lib/rpc-client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { adminDashboardKeys } from './query-key';

export const getAdminDashboardStatsEndpoint = rpc.api.v1['admin-dashboard'].stats.$get;

export type AdminDashboardStatsType = InferResponseType<typeof getAdminDashboardStatsEndpoint, 200>['data'];

export function useGetAdminDashboardStats() {
    return useSuspenseQuery({
        queryKey: adminDashboardKeys.all,
        queryFn: async () => {
            const res = await getAdminDashboardStatsEndpoint();
            if (!res.ok) {
                throw new Error('管理者ダッシュボード統計の取得に失敗しました');
            }
            return res.json();
        },
    });
}
