import { CategoryReturnType } from "@/features/api/get-category";
import { PriorityReturnType } from "@/features/api/get-priority";
import { StatusReturnType } from "@/features/api/get-status";
import { BulkUpdateManagementFormValues } from "../hooks/use-todo-management-bulk";
import { useTodoManagementBulkUpdateDialog } from "../hooks/use-todo-management-bulk-update-dialog";
import { TodoManagementBulkUpdateDialog } from "./todo-management-bulk-update-dialog";

type PropsType = {
    isOpen: boolean;
    selectedCount: number;
    isLoading: boolean;
    categoryList: CategoryReturnType;
    statusList: StatusReturnType;
    priorityList: PriorityReturnType;
    onClose: () => void;
    onConfirm: (values: BulkUpdateManagementFormValues) => void;
};

export function TodoManagementBulkUpdateDialogContainer(props: PropsType) {

    const {
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
    } = useTodoManagementBulkUpdateDialog(props);

    return (
        <TodoManagementBulkUpdateDialog
            isOpen={props.isOpen}
            selectedCount={props.selectedCount}
            isLoading={props.isLoading}
            categoryList={props.categoryList}
            statusList={props.statusList}
            priorityList={props.priorityList}
            categoryEnabled={categoryEnabled}
            onCategoryEnabledChange={setCategoryEnabled}
            statusEnabled={statusEnabled}
            onStatusEnabledChange={setStatusEnabled}
            priorityEnabled={priorityEnabled}
            onPriorityEnabledChange={setPriorityEnabled}
            categoryId={categoryId}
            onCategoryIdChange={setCategoryId}
            statusId={statusId}
            onStatusIdChange={setStatusId}
            priorityId={priorityId}
            onPriorityIdChange={setPriorityId}
            isMemoSelected={isMemoSelected}
            hasSelection={hasSelection}
            onClose={handleClose}
            onConfirm={handleConfirm}
        />
    );
}
