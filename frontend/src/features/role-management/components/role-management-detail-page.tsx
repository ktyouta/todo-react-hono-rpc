import { Loading } from "@/components";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button/scroll-to-top-button";
import { Suspense } from "react";
import { RoleManagementDetailContainer } from "./role-management-detail-container";

export function RoleManagementDetailPage() {
    return (
        <>
            <Suspense fallback={<Loading fullScreen={false} className="w-full min-h-full" />}>
                <RoleManagementDetailContainer />
            </Suspense>
            <ScrollToTopButton />
        </>
    );
}
