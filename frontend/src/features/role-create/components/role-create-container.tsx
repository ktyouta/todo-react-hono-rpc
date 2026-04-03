import { useRoleCreate } from "../hooks/use-role-create";
import { RoleCreateComplete } from "./role-create-complete";
import { RoleCreateForm } from "./role-create-form";

export function RoleCreateContainer() {
    const props = useRoleCreate();

    if (props.isCompleted) {
        return <RoleCreateComplete {...props} />;
    }

    return <RoleCreateForm {...props} />;
}
