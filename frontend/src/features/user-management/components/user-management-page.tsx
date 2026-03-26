import { Loading } from "@/components";
import { Suspense } from "react";
import { UserManagementListContainer } from "./user-management-list-container";

export function UserManagementPage() {
    return (
        <Suspense fallback={<Loading />}>
            <UserManagementListContainer />
        </Suspense>
    );
}
