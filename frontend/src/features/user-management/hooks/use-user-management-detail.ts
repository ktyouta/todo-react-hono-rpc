import { LoginUserContext } from "@/app/components/login-user-provider";
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
    // ユーザー詳細データ
    const { data } = useGetUserManagement({ id: userId });
    const user = data.data;
    // ナビゲーション用
    const { appGoBack } = useAppNavigation();
    // 削除確認ダイアログ
    const deleteDialog = useSwitch();
    // ロール変更確認ダイアログ
    const roleDialog = useSwitch();
    // パスワードリセット確認ダイアログ
    const passwordDialog = useSwitch();
    // ロール一覧
    const { data: role } = getRoleList();
    // ログインユーザー情報
    const loginUser = LoginUserContext.useCtx();

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
        defaultValues: { newPassword: '', confirmPassword: '' },
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

    /**
     * 一覧に戻る
     */
    function onClickBack() {
        appGoBack(paths.userManagement.path);
    }

    /**
     * ロール保存ボタン押下（バリデーション後に確認ダイアログを表示）
     */
    const clickSaveRole = roleForm.handleSubmit(() => {
        roleDialog.on();
    });

    /**
     * ロール変更確認ダイアログをキャンセル
     */
    function onCancelSaveRole() {
        roleDialog.off();
    }

    /**
     * ロール変更を確定実行
     */
    const onConfirmSaveRole = roleForm.handleSubmit((data) => {
        roleDialog.off();
        roleMutation.mutate({ roleId: data.roleId });
    });

    /**
     * パスワード設定ボタン押下（バリデーション後に確認ダイアログを表示）
     */
    const clickSavePassword = passwordForm.handleSubmit(() => {
        passwordDialog.on();
    });

    /**
     * パスワードリセット確認ダイアログをキャンセル
     */
    function onCancelSavePassword() {
        passwordDialog.off();
    }

    /**
     * パスワードリセットを確定実行
     */
    const onConfirmSavePassword = passwordForm.handleSubmit((data) => {
        passwordDialog.off();
        passwordMutation.mutate({ newPassword: data.newPassword });
    });

    /**
     * 削除ボタン押下（確認ダイアログを表示）
     */
    function onClickDelete() {
        deleteDialog.on();
    }

    /**
     * 削除確認ダイアログをキャンセル
     */
    function onCancelDelete() {
        deleteDialog.off();
    }

    /**
     * 削除を確定実行
     */
    function onConfirmDelete() {
        deleteDialog.off();
        deleteMutation.mutate();
    }

    return {
        user,
        onClickBack,
        roleForm,
        clickSaveRole,
        isRoleDialogOpen: roleDialog.flag,
        onCancelSaveRole,
        onConfirmSaveRole,
        isRoleLoading: roleMutation.isPending,
        passwordForm,
        clickSavePassword,
        isPasswordDialogOpen: passwordDialog.flag,
        onCancelSavePassword,
        onConfirmSavePassword,
        isPasswordLoading: passwordMutation.isPending,
        isDeleteDialogOpen: deleteDialog.flag,
        onClickDelete,
        onCancelDelete,
        onConfirmDelete,
        isDeleteLoading: deleteMutation.isPending,
        roleList: role.data,
        loginUser,
    };
}
