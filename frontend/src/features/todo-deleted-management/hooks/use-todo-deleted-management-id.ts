import { useParams } from "react-router-dom";

export function useTodoDeletedManagementId() {
    const { id } = useParams();
    if (!id) {
        throw new Error("タスクIDが存在しません");
    }
    return id;
}
