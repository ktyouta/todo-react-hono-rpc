import { useParams } from "react-router-dom";

export function useUserManagementId() {
    const { id } = useParams();
    if (!id) {
        throw new Error("ユーザーIDが存在しません");
    }
    return id;
}
