import { paths } from "@/config/paths";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useSwitch } from "@/hooks/use-switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getRoleList } from "../../api/get-role-list";
import { useDeleteUserManagementMutation } from "../api/delete-user-management";
import { useGetUserManagement } from "../api/get-user-management";
import { usePatchUserManagementPasswordMutation } from "../api/patch-user-management-password";
import { usePatchUserManagementRoleMutation } from "../api/patch-user-management-role";
import { UserManagementPasswordFormType, UserManagementPasswordSchema } from "../types/user-management-password-form";
import { UserManagementRoleFormType, UserManagementRoleSchema } from "../types/user-management-role-form";
import { useUserManagementId } from "./use-user-management-id";

export function useUserManagementDetail() {
    // ユーザーID
    const userId = useUserManagementId();
    // ユーザー一覧
    const { data } = useGetUserManagement({ id: userId });
    const user = data.data;
    // ナビゲーション用
    const { appGoBack } = useAppNavigation();
    // 削除ダイアログ
    const deleteDialog = useSwitch();
    // ロール一覧
    const { data: role } = getRoleList();

    // ロール更新フォーム
    const roleForm = useForm<UserManagementRoleFormType>({
        resolver: zodResolver(UserManagementRoleSchema),
        defaultValues: { roleId: user.roleId },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });

    // パスワード更新フォーム
    const passwordForm = useForm<UserManagementPasswordFormType>({
        resolver: zodResolver(UserManagementPasswordSchema),
        defaultValues: { newPassword: '' },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });

    // ロール更新用ミューテーション
    const roleMutation = usePatchUserManagementRoleMutation({
        id: userId,
        onSuccess: (message) => {
            toast.success(message);
        },
        onError: () => {
            toast.error('ロールの変更に失敗しました。時間をおいて再度お試しください。');
        },
    });

    // パスワード更新用ミューテーション
    const passwordMutation = usePatchUserManagementPasswordMutation({
        id: userId,
        onSuccess: (message) => {
            toast.success(message);
            passwordForm.reset();
        },
        onError: () => {
            toast.error('パスワードのリセットに失敗しました。時間をおいて再度お試しください。');
        },
    });

    // ユーザー削除用ミューテーション
    const deleteMutation = useDeleteUserManagementMutation({
        id: userId,
        onSuccess: (message) => {
            toast.success(message);
            appGoBack(paths.userManagement.path);
        },
        onError: () => {
            toast.error('ユーザーの削除に失敗しました。時間をおいて再度お試しください。');
        },
    });

    function onClickBack() {
        appGoBack(paths.userManagement.path);
    }

    const clickSaveRole = roleForm.handleSubmit((data) => {
        roleMutation.mutate({ roleId: data.roleId });
    });

    const clickSavePassword = passwordForm.handleSubmit((data) => {
        passwordMutation.mutate({ newPassword: data.newPassword });
    });

    function onClickDelete() {
        deleteDialog.on();
    }

    function onCancelDelete() {
        deleteDialog.off();
    }

    function onConfirmDelete() {
        deleteDialog.off();
        deleteMutation.mutate();
    }

    return {
        user,
        onClickBack,
        roleForm,
        clickSaveRole,
        isRoleLoading: roleMutation.isPending,
        passwordForm,
        clickSavePassword,
        isPasswordLoading: passwordMutation.isPending,
        isDeleteDialogOpen: deleteDialog.flag,
        onClickDelete,
        onCancelDelete,
        onConfirmDelete,
        isDeleteLoading: deleteMutation.isPending,
        roleList: role.data,
    };
}
