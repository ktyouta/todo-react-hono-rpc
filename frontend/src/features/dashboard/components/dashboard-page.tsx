import { Loading } from '@/components';
import { Suspense } from 'react';
import { DashboardContentContainer } from './dashboard-content-container';

export function DashboardPage() {
    return (
        <div className="w-full min-h-full">
            <Suspense fallback={<Loading className="w-full min-h-full" />}>
                <DashboardContentContainer />
            </Suspense>
        </div>
    );
}
