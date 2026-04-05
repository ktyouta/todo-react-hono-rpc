import { CategoryReturnType } from "@/features/api/get-category";
import { PriorityReturnType } from "@/features/api/get-priority";
import { StatusReturnType } from "@/features/api/get-status";
import { BulkUpdateFormValues } from "../hooks/use-todo-bulk";
import { useTodoBulkUpdateDialog } from "../hooks/use-todo-bulk-update-dialog";
import { TodoBulkUpdateDialog } from "./todo-bulk-update-dialog";

type PropsType = {
    isOpen: boolean;
    selectedCount: number;
    isLoading: boolean;
    categoryList: CategoryReturnType;
    statusList: StatusReturnType;
    priorityList: PriorityReturnType;
    onClose: () => void;
    onConfirm: (values: BulkUpdateFormValues) => void;
};

export function TodoBulkUpdateDialogContainer(props: PropsType) {

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
    } = useTodoBulkUpdateDialog(props);

    return (
        <TodoBulkUpdateDialog
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
