import { useGetAdminDashboardStats } from '../api/get-admin-dashboard-stats';

export function useAdminDashboardStats() {
    const { data } = useGetAdminDashboardStats();
    return { stats: data.data };
}
