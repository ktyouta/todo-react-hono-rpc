import { useUserDeletedManagementList } from "../hooks/use-user-deleted-management-list";
import { UserDeletedManagementList } from "./user-deleted-management-list";

export function UserDeletedManagementListContainer() {
    const props = useUserDeletedManagementList();
    return <UserDeletedManagementList {...props} />;
}
