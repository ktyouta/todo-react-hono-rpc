import { NotFound } from '@/components';
import { paths } from '@/config/paths';
import { LoginContainer } from '@/features/login/components/login-container';
import { SignupContainer } from '@/features/signup/components/signup-container';
import { TodoCreateContainer } from '@/features/todo-create/components/create-todo-container';
import { Todo } from '@/features/todo/components/todo';
import { TodoLayout } from '@/features/todo/components/todo-layout';
import { UpdatePasswordContainer } from '@/features/updatepassword/components/update-password-container';
import { UpdateUserContainer } from '@/features/updateuser/components/update-user-container';
import { Navigate, useRoutes } from 'react-router-dom';
import { DashboardContainer } from './dashboard-container';
import { GuestRoute } from './guest-route';
import { ProtectedRoute } from './protected-route';

const routerList = [
    {
        path: paths.home.path,
        element: (
            <Navigate to={paths.login.path} replace />
        )
    },
    {
        element: <GuestRoute />,
        children: [
            {
                path: paths.login.path,
                element: (
                    <LoginContainer />
                )
            },
            {
                path: paths.signup.path,
                element: (
                    <SignupContainer />
                )
            },
        ],
    },
    {
        element: (
            <ProtectedRoute />
        ),
        children: [
            {
                element: (
                    <DashboardContainer />
                ),
                children: [
                    {
                        element: (
                            <TodoLayout />
                        ),
                        children: [
                            {
                                path: paths.todo.path,
                                element: (
                                    <Todo />
                                )
                            },
                            {
                                path: paths.todoDetail.path,
                                element: (
                                    <div>
                                        タスク詳細
                                    </div>
                                )
                            }
                        ]
                    },
                    {
                        path: paths.todoCreate.path,
                        element: (
                            <TodoCreateContainer />
                        )
                    }
                ]
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
            },
        ],
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
