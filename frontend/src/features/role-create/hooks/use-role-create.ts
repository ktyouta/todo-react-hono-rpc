import { getPermissionList } from "@/features/api/get-permission-list";
import { paths } from "@/config/paths";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { usePostRoleCreateMutation } from "../api/post-role-create";
import { ROLE_CREATE_DEFAULT_VALUES, useRoleCreateForm } from "./use-role-create.form";

export function useRoleCreate() {
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useRoleCreateForm();
    const { data: permissionListData } = getPermissionList();
    const permissionList = permissionListData.data;
    const [isCompleted, setIsCompleted] = useState(false);
    const [createdName, setCreatedName] = useState("");
    const { appNavigate } = useAppNavigation();

    const postMutation = usePostRoleCreateMutation({
        onSuccess: (response) => {
            setCreatedName(response.data.name);
            setIsCompleted(true);
        },
        onError: (errMessage) => {
            toast.error(errMessage);
        },
    });

    const selectedPermissionIds = watch("permissionIds");

    function togglePermission(permissionId: number) {
        if (selectedPermissionIds.includes(permissionId)) {
            setValue("permissionIds", selectedPermissionIds.filter((id) => id !== permissionId));
        } else {
            setValue("permissionIds", [...selectedPermissionIds, permissionId]);
        }
    }

    function clickClear() {
        reset(ROLE_CREATE_DEFAULT_VALUES);
    }

    const clickCreate = handleSubmit((data) => {
        postMutation.mutate({
            name: data.name,
            permissionIds: data.permissionIds,
        });
    });

    function clickContinue() {
        setIsCompleted(false);
        setCreatedName("");
        reset(ROLE_CREATE_DEFAULT_VALUES);
    }

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
