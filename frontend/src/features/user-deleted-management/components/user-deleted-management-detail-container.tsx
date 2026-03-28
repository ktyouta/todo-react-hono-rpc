import { useUserDeletedManagementDetail } from "../hooks/use-user-deleted-management-detail";
import { UserDeletedManagementDetailView } from "./user-deleted-management-detail-view";

export function UserDeletedManagementDetailContainer() {
    const props = useUserDeletedManagementDetail();
    return <UserDeletedManagementDetailView {...props} />;
}
