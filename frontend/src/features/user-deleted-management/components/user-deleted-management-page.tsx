import { Loading } from "@/components";
import { Suspense } from "react";
import { UserDeletedManagementListContainer } from "./user-deleted-management-list-container";

export function UserDeletedManagementPage() {
    return (
        <Suspense fallback={<Loading />}>
            <UserDeletedManagementListContainer />
        </Suspense>
    );
}
