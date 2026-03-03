import { useParams } from "react-router-dom";

export function useTaskId() {

    // 動画ID
    const { id } = useParams<{ id: string }>();

    if (!id) {
        throw Error(`タスクIDが存在しません。`);
    }

    return id;
}