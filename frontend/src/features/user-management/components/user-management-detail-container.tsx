import { useUserManagementDetail } from "../hooks/use-user-management-detail";
import { UserManagementDetail } from "./user-management-detail";

export function UserManagementDetailContainer() {
    const props = useUserManagementDetail();
    return <UserManagementDetail {...props} />;
}
