import { useParams } from "react-router-dom";

export function useRoleManagementId() {
    const { id } = useParams();
    if (!id) {
        throw new Error("ロールIDが存在しません");
    }
    return id;
}
