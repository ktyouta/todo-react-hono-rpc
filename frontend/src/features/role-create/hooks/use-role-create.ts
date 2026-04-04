import { paths } from "@/config/paths";
import { getPermissionList } from "@/features/api/get-permission-list";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { usePostRoleCreateMutation } from "../api/post-role-create";
import { ROLE_CREATE_DEFAULT_VALUES, useRoleCreateForm } from "./use-role-create.form";

export function useRoleCreate() {
    // フォーム操作メソッドとバリデーションエラー
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useRoleCreateForm();
    // パーミッション一覧データ
    const { data: permissionListData } = getPermissionList();
    // パーミッション一覧（APIレスポンスのdata）
    const permissionList = permissionListData.data;
    // 作成完了フラグ
    const [isCompleted, setIsCompleted] = useState(false);
    // 作成したロール名（完了画面表示用）
    const [createdName, setCreatedName] = useState("");
    // ナビゲーション用
    const { appNavigate } = useAppNavigation();

    // ロール作成APIのmutation設定
    const postMutation = usePostRoleCreateMutation({
        onSuccess: (response) => {
            setCreatedName(response.data.name);
            setIsCompleted(true);
        },
        onError: (errMessage) => {
            toast.error(errMessage);
        },
    });

    // 現在選択中のパーミッションID一覧
    const selectedPermissionIds = watch("permissionIds");

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
     * フォームをデフォルト値にリセットする
     */
    function clickClear() {
        reset(ROLE_CREATE_DEFAULT_VALUES);
    }

    /**
     * フォームを送信してロールを作成する
     */
    const clickCreate = handleSubmit((data) => {
        postMutation.mutate({
            name: data.name,
            permissionIds: data.permissionIds,
        });
    });

    /**
     * 完了状態をリセットして続けて作成できる状態に戻す
     */
    function clickContinue() {
        setIsCompleted(false);
        setCreatedName("");
        reset(ROLE_CREATE_DEFAULT_VALUES);
    }

    /**
     * ロール管理一覧画面へ遷移する
     */
    function clickGoToList() {
        appNavigate(paths.roleManagement.path);
    }

    return {
        register,
        errors,
        clickCreate,
        clickClear,
        clickContinue,
        clickGoToList,
        permissionList,
        selectedPermissionIds,
        togglePermission,
        isLoading: postMutation.isPending,
        isCompleted,
        createdName,
    };
}
