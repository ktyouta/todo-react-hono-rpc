import { Loading } from "@/components";
import { Suspense } from "react";
import { RoleManagementDetailContainer } from "./role-management-detail-container";

export function RoleManagementDetailPage() {
    return (
        <Suspense fallback={<Loading />}>
            <RoleManagementDetailContainer />
        </Suspense>
    );
}
