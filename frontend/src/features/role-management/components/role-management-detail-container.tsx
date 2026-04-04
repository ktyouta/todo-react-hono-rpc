import { useRoleManagementDetail } from "../hooks/use-role-management-detail";
import { RoleManagementDetailEdit } from "./role-management-detail-edit";
import { RoleManagementDetailView } from "./role-management-detail-view";

export function RoleManagementDetailContainer() {
    const props = useRoleManagementDetail();

    // 編集モード
    if (props.isEditMode) {
        return (
            <RoleManagementDetailEdit
                {...props}
            />
        );
    }

    return (
        <RoleManagementDetailView
            {...props}
        />
    );
}
