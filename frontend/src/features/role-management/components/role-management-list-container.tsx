import { useRoleManagementList } from "../hooks/use-role-management-list";
import { RoleManagementList } from "./role-management-list";

export function RoleManagementListContainer() {
    const props = useRoleManagementList();
    return <RoleManagementList {...props} />;
}
