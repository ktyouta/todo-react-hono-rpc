import { Loading, NotFound } from "@/components";
import { Suspense } from "react";
import { useUserManagementId } from "../hooks/use-user-management-id";
import { UserManagementDetailContainer } from "./user-management-detail-container";

export function UserManagementDetailPage() {
    const id = useUserManagementId();

    if (!/^\d+$/.test(id)) {
        return <NotFound />;
    }

    return (
        <Suspense fallback={<Loading />}>
            <UserManagementDetailContainer />
        </Suspense>
    );
}
