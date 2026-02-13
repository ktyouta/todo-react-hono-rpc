import { paths } from '@/config/paths';
import { Todo } from '@/features/todo/components/todo';
import { UpdatePasswordContainer } from '@/features/updatepassword/components/update-password-container';
import { UpdateUserContainer } from '@/features/updateuser/components/update-user-container';
import { ReactNode } from 'react';

export const protectedRouterList: { path: string, element: ReactNode }[] = [
    {
        path: paths.todo.path,
        element: (
            <Todo />
        )
    },
    {
        path: paths.updateUser.path,
        element: (
            <UpdateUserContainer />
        )
    },
    {
        path: paths.updatePassword.path,
        element: (
            <UpdatePasswordContainer />
        )
    }
];
