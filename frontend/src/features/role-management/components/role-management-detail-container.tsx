import { useRoleManagementDetail } from "../hooks/use-role-management-detail";
import { RoleManagementDetail } from "./role-management-detail";

export function RoleManagementDetailContainer() {
    const props = useRoleManagementDetail();
    return <RoleManagementDetail {...props} />;
}
