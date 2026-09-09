import { Loading } from "@/components";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button/scroll-to-top-button";
import { Suspense } from "react";
import { UserDeletedManagementListContainer } from "./user-deleted-management-list-container";

export function UserDeletedManagementPage() {
    return (
        <>
            <Suspense fallback={<Loading fullScreen={false} className="w-full min-h-full" />}>
                <UserDeletedManagementListContainer />
            </Suspense>
            <ScrollToTopButton />
        </>
    );
}
