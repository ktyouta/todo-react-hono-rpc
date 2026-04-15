import { useSubtaskCreate } from "../hooks/use-subtask-create";
import { SubtaskCreateView } from "./subtask-create-view";

export function SubtaskCreateContainer() {

    const props = useSubtaskCreate();

    return (
        <SubtaskCreateView
            {...props}
        />
    );
}
