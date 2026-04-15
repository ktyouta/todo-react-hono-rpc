import { useSubtaskDetail } from "../hooks/use-subtask-detail";
import { SubtaskDetailEdit } from "./subtask-detail-edit";
import { SubtaskDetailView } from "./subtask-detail-view";

export function SubtaskDetailContainer() {

    const props = useSubtaskDetail();

    if (props.isEditMode) {
        return (
            <SubtaskDetailEdit
                {...props}
            />
        );
    }

    return (
        <SubtaskDetailView
            {...props}
        />
    );
}
