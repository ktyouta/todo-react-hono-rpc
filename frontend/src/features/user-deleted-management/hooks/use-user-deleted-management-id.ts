import { useParams } from "react-router-dom";

export function useUserDeletedManagementId() {
    const { id } = useParams();
    if (!id) {
        throw new Error("ユーザーIDが存在しません");
    }
    return id;
}
