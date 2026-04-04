import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RoleCreateRequestSchema, RoleCreateRequestType } from "../types/role-create-request-type";

// フォームの初期値
export const ROLE_CREATE_DEFAULT_VALUES: RoleCreateRequestType = {
    name: "",
    permissionIds: [],
};

/**
 * ロール作成フォームのreact-hook-form設定を返す
 */
export function useRoleCreateForm() {
    return useForm<RoleCreateRequestType>({
        resolver: zodResolver(RoleCreateRequestSchema),
        defaultValues: ROLE_CREATE_DEFAULT_VALUES,
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });
}
