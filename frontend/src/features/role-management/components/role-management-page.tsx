import { Loading } from "@/components";
import { Suspense } from "react";
import { RoleManagementListContainer } from "./role-management-list-container";

export function RoleManagementPage() {
    return (
        <Suspense fallback={<Loading />}>
            <RoleManagementListContainer />
        </Suspense>
    );
}
