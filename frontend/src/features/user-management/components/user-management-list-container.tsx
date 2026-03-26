import { useUserManagementList } from "../hooks/use-user-management-list";
import { UserManagementList } from "./user-management-list";

export function UserManagementListContainer() {
    const props = useUserManagementList();
    return <UserManagementList {...props} />;
}
