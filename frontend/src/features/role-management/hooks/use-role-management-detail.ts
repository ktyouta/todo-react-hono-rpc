import { paths } from "@/config/paths";
import { getPermissionList } from "@/features/api/get-permission-list";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useSwitch } from "@/hooks/use-switch";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDeleteRoleManagementMutation } from "../api/delete-role-management";
import { useGetRoleManagement } from "../api/get-role-management";
import { usePutRoleManagementMutation } from "../api/put-role-management";
import { useRoleManagementDetailForm } from "./use-role-management-detail.form";
import { useRoleManagementId } from "./use-role-management-id";

export function useRoleManagementDetail() {
    // ロールID
    const roleId = useRoleManagementId();
    // ロール詳細データ
    const { data } = useGetRoleManagement({ id: roleId });
    const role = data.data;
    // パーミッション一覧（編集モードのチェックボックス用）
    const { data: permissionListData } = getPermissionList();
    const permissionList = permissionListData.data;
    // ナビゲーション用
    const { appGoBack } = useAppNavigation();
    // 編集モードフラグ
    const [isEditMode, setIsEditMode] = useState(false);
    // 保存確認ダイアログ
    const saveDialog = useSwitch();
    // 削除確認ダイアログ
    const deleteDialog = useSwitch();

    // フォーム
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue, setError } = useRoleManagementDetailForm({
        name: role.name,
        permissionIds: role.permissions.map((p) => p.permissionId),
    });

    // 現在選択中のパーミッションID一覧
    const selectedPermissionIds = watch("permissionIds");

    // 必須パーミッションID一覧（isProtected=true のもの）
    const requiredPermissionIds = permissionList
        .filter((p) => p.isProtected)
        .map((p) => p.permissionId);

    // 更新mutation
    const updateMutation = usePutRoleManagementMutation({
        id: roleId,
        onSuccess: (message) => {
            toast.success(message);
            setIsEditMode(false);
        },
        onError: (message) => {
            toast.error(message ?? 'ロールの更新に失敗しました。時間をおいて再度お試しください。');
        },
    });

    // 削除mutation
    const deleteMutation = useDeleteRoleManagementMutation({
        id: roleId,
        onSuccess: (message) => {
            toast.success(message);
            appGoBack(paths.roleManagement.path);
        },
        onError: (message) => {
            toast.error(message ?? 'ロールの削除に失敗しました。時間をおいて再度お試しください。');
        },
    });

    /**
     * パーミッションの選択状態をトグルする
     * @param permissionId トグル対象のパーミッションID
     */
    function togglePermission(permissionId: number) {
        if (selectedPermissionIds.includes(permissionId)) {
            setValue("permissionIds", selectedPermissionIds.filter((id) => id !== permissionId));
        }
        else {
            setValue("permissionIds", [...selectedPermissionIds, permissionId]);
        }
    }

    /**
     * 一覧に戻る
     */
    function onClickBack() {
        appGoBack(paths.roleManagement.path);
    }

    /**
     * 編集モードに切り替える
     */
    function onClickEdit() {
        reset({
            name: role.name,
            permissionIds: role.permissions.map((p) => p.permissionId),
        });
        setIsEditMode(true);
    }

    /**
     * 編集をキャンセルして閲覧モードに戻る
     */
    function onClickCancel() {
        setIsEditMode(false);
        reset({
            name: role.name,
            permissionIds: role.permissions.map((p) => p.permissionId),
        });
    }

    /**
     * 保存ボタン押下（バリデーション・必須チェック後に確認ダイアログを表示）
     */
    const clickSave = handleSubmit((data) => {
        const missingRequired = requiredPermissionIds.filter((id) => !data.permissionIds.includes(id));
        if (role.isProtected && missingRequired.length > 0) {
            setError("permissionIds", { message: "必須のパーミッションがチェックされていません" });
            return;
        }
        saveDialog.on();
    });

    /**
     * 保存確認ダイアログをキャンセル
     */
    function onCancelSave() {
        saveDialog.off();
    }

    /**
     * 保存を確定実行
     */
    const onConfirmSave = handleSubmit((data) => {
        saveDialog.off();
        updateMutation.mutate({ name: data.name, permissionIds: data.permissionIds });
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
        role,
        permissionList,
        selectedPermissionIds,
        requiredPermissionIds,
        togglePermission,
        register,
        errors,
        clickSave,
        onClickBack,
        isEditMode,
        onClickEdit,
        onClickCancel,
        isSaveDialogOpen: saveDialog.flag,
        onCancelSave,
        onConfirmSave,
        isSaveLoading: updateMutation.isPending,
        isDeleteDialogOpen: deleteDialog.flag,
        onClickDelete,
        onCancelDelete,
        onConfirmDelete,
        isDeleteLoading: deleteMutation.isPending,
    };
}
