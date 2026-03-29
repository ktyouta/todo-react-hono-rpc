import { paths } from "@/config/paths";
import { getRoleList } from "@/features/api/get-role-list";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useCreateYearList } from "@/hooks/use-create-year-list";
import { formatBirthday } from "@/utils/date-util";
import { useState } from "react";
import { toast } from "react-toastify";
import { usePostUserCreateMutation } from "../api/post-user-create";
import { useUserCreateForm } from "./use-user-create.form";

const DEFAULT_FORM_VALUES = {
    name: "",
    birthday: { year: "", month: "", day: "" },
    password: "",
    confirmPassword: "",
    roleId: 1,
} as const;

export function useUserCreate() {
    const { register, control, handleSubmit, formState: { errors }, reset, watch } = useUserCreateForm();
    const { data: roleListData } = getRoleList();
    const roleList = roleListData.data;
    const yearComboList = useCreateYearList();
    const [isCompleted, setIsCompleted] = useState(false);
    const [createdName, setCreatedName] = useState("");
    const { appNavigate } = useAppNavigation();

    const postMutation = usePostUserCreateMutation({
        onSuccess: (response) => {
            setCreatedName(response.data.name);
            setIsCompleted(true);
        },
        onError: (errMessage) => {
            toast.error(errMessage);
        },
    });

    function clickClear() {
        reset(DEFAULT_FORM_VALUES);
    }

    const clickCreate = handleSubmit((data) => {
        postMutation.mutate({
            name: data.name,
            birthday: formatBirthday(data.birthday),
            password: data.password,
            confirmPassword: data.confirmPassword,
            roleId: data.roleId,
        });
    });

    function clickContinue() {
        setIsCompleted(false);
        setCreatedName("");
        reset(DEFAULT_FORM_VALUES);
    }

    function clickGoToList() {
        appNavigate(paths.userManagement.path);
    }

    return {
        register,
        control,
        errors,
        clickCreate,
        clickClear,
        clickContinue,
        roleList,
        yearComboList,
        watch,
        isLoading: postMutation.isPending,
        isCompleted,
        createdName,
        clickGoToList,
    };
}
