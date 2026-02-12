import { paths } from '@/config/paths';
import { LoginContainer } from '@/features/login/components/login-container';
import { SignupContainer } from '@/features/signup/components/signup-container';
import { Todo } from '@/features/todo/components/todo';
import { UpdatePasswordContainer } from '@/features/updatepassword/components/update-password-container';
import { UpdateUserContainer } from '@/features/updateuser/components/update-user-container';
import { lazy, ReactNode } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { GuestRoute } from './guest-route';
import { ProtectedRoute } from './protected-route';

// lazy import（コード分割）
const NotFound = lazy(() => import('@/components/pages/notfound/not-found').then(m => ({ default: m.NotFound })));


const routerList: { path: string, element: ReactNode }[] = [
    {
        path: paths.home.path,
        element: (
            <Navigate to={paths.login.path} replace />
        )
    },
    {
        path: paths.todo.path,
        element: (
            <ProtectedRoute>
                <Todo />
            </ProtectedRoute>
        )
    },
    {
        path: paths.login.path,
        element: (
            <GuestRoute>
                <LoginContainer />
            </GuestRoute>
        )
    },
    {
        path: paths.signup.path,
        element: (
            <GuestRoute>
                <SignupContainer />
            </GuestRoute>
        )
    },
    {
        path: paths.updateUser.path,
        element: (
            <ProtectedRoute>
                <UpdateUserContainer />
            </ProtectedRoute>
        )
    },
    {
        path: paths.updatePassword.path,
        element: (
            <ProtectedRoute>
                <UpdatePasswordContainer />
            </ProtectedRoute>
        )
    },
    {
        path: `*`,
        element: <NotFound />
    }
];

export const AppRouter = () => {
    const router = useRoutes(routerList);
    return router;
};
