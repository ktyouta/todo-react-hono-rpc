import { CATEGORY_ID } from "@/constants/master";
import { CategoryReturnType } from "@/features/api/get-category";
import { PriorityReturnType } from "@/features/api/get-priority";
import { StatusReturnType } from "@/features/api/get-status";
import { useState } from "react";
import { BulkUpdateManagementFormValues } from "./use-todo-management-bulk";

type PropsType = {
    categoryList: CategoryReturnType;
    statusList: StatusReturnType;
    priorityList: PriorityReturnType;
    onClose: () => void;
    onConfirm: (values: BulkUpdateManagementFormValues) => void;
};

export function useTodoManagementBulkUpdateDialog({ categoryList, statusList, priorityList, onClose, onConfirm }: PropsType) {

    // カテゴリ変更有効フラグ
    const [categoryEnabled, setCategoryEnabledState] = useState(false);
    // ステータス変更有効フラグ
    const [statusEnabled, setStatusEnabled] = useState(false);
    // 優先度変更有効フラグ
    const [priorityEnabled, setPriorityEnabled] = useState(false);
    // 選択中のカテゴリID
    const [categoryId, setCategoryId] = useState<number>(categoryList[0]?.id ?? 1);
    // 選択中のステータスID
    const [statusId, setStatusId] = useState<number>(statusList[0]?.id ?? 1);
    // 選択中の優先度ID
    const [priorityId, setPriorityId] = useState<number>(priorityList[0]?.id ?? 1);
    // メモカテゴリ選択中フラグ（ステータス・優先度を無効化する）
    const isMemoSelected = categoryEnabled && categoryId === CATEGORY_ID.MEMO;
    // 1つ以上の変更項目が有効かどうか
    const hasSelection = categoryEnabled || statusEnabled || priorityEnabled;

    /**
     * カテゴリ有効化切替（無効化時はステータス・優先度もリセット）
     */
    function setCategoryEnabled(checked: boolean) {
        setCategoryEnabledState(checked);
        if (!checked) {
            setStatusEnabled(false);
            setPriorityEnabled(false);
        }
    }

    /**
     * 確定処理（有効フィールドのみ値を組み立ててコールバック）
     */
    function handleConfirm() {
        const values: BulkUpdateManagementFormValues = {};
        if (categoryEnabled) {
            values.categoryId = categoryId;
        }
        if (statusEnabled && !isMemoSelected) {
            values.statusId = statusId;
        }
        if (priorityEnabled && !isMemoSelected) {
            values.priorityId = priorityId;
        }
        onConfirm(values);
    }

    /**
     * クローズ処理（state リセット後にコールバック）
     */
    function handleClose() {
        setCategoryEnabledState(false);
        setStatusEnabled(false);
        setPriorityEnabled(false);
        setCategoryId(categoryList[0]?.id ?? 1);
        setStatusId(statusList[0]?.id ?? 1);
        setPriorityId(priorityList[0]?.id ?? 1);
        onClose();
    }

    return {
        categoryEnabled,
        setCategoryEnabled,
        statusEnabled,
        setStatusEnabled,
        priorityEnabled,
        setPriorityEnabled,
        categoryId,
        setCategoryId,
        statusId,
        setStatusId,
        priorityId,
        setPriorityId,
        isMemoSelected,
        hasSelection,
        handleConfirm,
        handleClose,
    };
}
