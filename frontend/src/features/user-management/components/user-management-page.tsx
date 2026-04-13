import { Loading } from "@/components";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button/scroll-to-top-button";
import { Suspense } from "react";
import { UserManagementListContainer } from "./user-management-list-container";

export function UserManagementPage() {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <UserManagementListContainer />
            </Suspense>
            <ScrollToTopButton />
        </>
    );
}
