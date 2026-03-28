import { Loading, NotFound } from "@/components";
import { Suspense } from "react";
import { useUserDeletedManagementId } from "../hooks/use-user-deleted-management-id";
import { UserDeletedManagementDetailContainer } from "./user-deleted-management-detail-container";

export function UserDeletedManagementDetailPage() {
    const id = useUserDeletedManagementId();

    if (!/^\d+$/.test(id)) {
        return <NotFound />;
    }

    return (
        <Suspense fallback={<Loading />}>
            <UserDeletedManagementDetailContainer />
        </Suspense>
    );
}
