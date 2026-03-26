export type UserManagementSearchFilter = {
    name: string;
    roleId: string;
    createdAtFrom: string | null;
    createdAtTo: string | null;
    updatedAtFrom: string | null;
    updatedAtTo: string | null;
};

export const initialUserManagementSearchFilter: UserManagementSearchFilter = {
    name: '',
    roleId: '',
    createdAtFrom: null,
    createdAtTo: null,
    updatedAtFrom: null,
    updatedAtTo: null,
};
