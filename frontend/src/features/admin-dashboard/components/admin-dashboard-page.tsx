import { Loading } from '@/components';
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button/scroll-to-top-button";
import { Suspense } from 'react';
import { AdminDashboardContentContainer } from './admin-dashboard-content-container';

export function AdminDashboardPage() {
    return (
        <div className="w-full min-h-full">
            <Suspense fallback={<Loading className="w-full min-h-full" />}>
                <AdminDashboardContentContainer />
            </Suspense>
            <ScrollToTopButton />
        </div>
    );
}
