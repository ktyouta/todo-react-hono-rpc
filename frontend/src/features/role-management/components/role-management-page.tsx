import { Loading } from "@/components";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button/scroll-to-top-button";
import { Suspense } from "react";
import { RoleManagementListContainer } from "./role-management-list-container";

export function RoleManagementPage() {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <RoleManagementListContainer />
            </Suspense>
            <ScrollToTopButton />
        </>
    );
}
