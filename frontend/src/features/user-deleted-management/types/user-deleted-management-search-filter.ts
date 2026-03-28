export type UserDeletedManagementSearchFilter = {
    name: string;
    roleId: string;
    createdAtFrom: string | null;
    createdAtTo: string | null;
    updatedAtFrom: string | null;
    updatedAtTo: string | null;
};

export const initialUserDeletedManagementSearchFilter: UserDeletedManagementSearchFilter = {
    name: '',
    roleId: '',
    createdAtFrom: null,
    createdAtTo: null,
    updatedAtFrom: null,
    updatedAtTo: null,
};
