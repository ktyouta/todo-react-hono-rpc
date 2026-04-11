import { rpc } from '@/lib/rpc-client';
import { InferResponseType } from 'hono';

export const getDashboardStatsEndpoint = rpc.api.v1.todo.stats.$get;

export type DashboardStatsType = InferResponseType<typeof getDashboardStatsEndpoint, 200>['data'];
