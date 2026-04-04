import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RoleManagementUpdateFormType, RoleManagementUpdateSchema } from "../types/role-management-update-form";

/**
 * ロール管理詳細（編集）フォームのreact-hook-form設定を返す
 */
export function useRoleManagementDetailForm(defaultValues: RoleManagementUpdateFormType) {
    return useForm<RoleManagementUpdateFormType>({
        resolver: zodResolver(RoleManagementUpdateSchema),
        defaultValues,
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });
}
