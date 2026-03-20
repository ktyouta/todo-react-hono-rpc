import { useParams } from "react-router-dom";

export function useTaskManagementId() {
    const { id } = useParams();
    if (!id) {
        throw new Error("タスクIDが存在しません");
    }
    return id;
}
