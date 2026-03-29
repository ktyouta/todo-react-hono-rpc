import { useUserCreate } from "../hooks/use-user-create";
import { UserCreateComplete } from "./user-create-complete";
import { UserCreateForm } from "./user-create-form";

export function UserCreateContainer() {
    const props = useUserCreate();

    if (props.isCompleted) {
        return <UserCreateComplete {...props} />;
    }

    return <UserCreateForm {...props} />;
}
