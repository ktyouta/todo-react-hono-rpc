import { useSubtaskSection } from "../hooks/use-subtask-section";
import { SubtaskSection } from "./subtask-section";

export function SubtaskSectionContainer() {

    const props = useSubtaskSection();

    return (
        <SubtaskSection
            {...props}
        />
    );
}
