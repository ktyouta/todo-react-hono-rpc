import { useParams } from "react-router-dom";

export function useSubtaskId() {

    // サブタスクID
    const { subId } = useParams<{ subId: string }>();

    if (!subId) {
        throw Error(`サブタスクIDが存在しません。`);
    }

    return subId;
}
