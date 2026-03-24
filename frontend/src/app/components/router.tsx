import { NotFound } from '@/components';
import { paths } from '@/config/paths';
import { LoginContainer } from '@/features/login/components/login-container';
import { SignupContainer } from '@/features/signup/components/signup-container';
import { TodoCreateContainer } from '@/features/todo-create/components/create-todo-container';
import { TodoDeletedManagementDetailPage } from '@/features/todo-deleted-management/components/todo-deleted-management-detail-page';
import { TodoDeletedManagementPage } from '@/features/todo-deleted-management/components/todo-deleted-management-page';
import { TodoManagementDetailPage } from '@/features/todo-management/components/todo-management-detail-page';
import { TodoManagementPage } from '@/features/todo-management/components/todo-management-page';
import { TodoDetailPage } from '@/features/todo/components/todo-detail-page';
import { TodoLayout } from '@/features/todo/components/todo-layout';
import { TodoPage } from '@/features/todo/components/todo-page';
import { UpdatePasswordContainer } from '@/features/updatepassword/components/update-password-container';
import { UpdateUserContainer } from '@/features/updateuser/components/update-user-container';
import { Navigate, useRoutes } from 'react-router-dom';
import { DashboardContainer } from './dashboard-container';
import { GuestRoute } from './guest-route';
import { ProtectedRoute } from './protected-route';
import { RoleRoute } from './role-route';

const routerList = [
    {
        path: paths.home.path,
        element: (
            // 未ログインはログイン画面へリダイレクト
            <Navigate to={paths.login.path} replace />
        )
    },
    {
        // 未認証ガード：ログイン済みはtodo画面へリダイレクト
        element: <GuestRoute />,
        children: [
            {
                // ログイン
                path: paths.login.path,
                element: (
                    <LoginContainer />
                )
            },
            {
                // サインアップ
                path: paths.signup.path,
                element: (
                    <SignupContainer />
                )
            },
        ],
    },
    {
        element: (
            // 認証ガード：未ログインはログイン画面へリダイレクト
            <ProtectedRoute />
        ),
        children: [
            {
                element: (
                    // サイドバー・ナビゲーション等の共通レイアウト
                    <DashboardContainer />
                ),
                children: [
                    {
                        element: (
                            // todo画面
                            <TodoLayout />
                        ),
                        children: [
                            {
                                // todo一覧
                                path: paths.todo.path,
                                element: (
                                    <TodoPage />
                                )
                            },
                            {
                                // todo詳細
                                path: paths.todoDetail.path,
                                element: (
                                    <TodoDetailPage />
                                )
                            }
                        ]
                    },
                    {
                        // todo作成
                        path: paths.todoCreate.path,
                        element: (
                            <TodoCreateContainer />
                        )
                    },
                    {
                        // 権限ガード：task_management 権限なしは404
                        element: (
                            <RoleRoute
                                permission="task_management"
                            />
                        ),
                        children: [
                            {
                                element: <TodoLayout />,
                                children: [
                                    {
                                        // タスク管理一覧
                                        path: paths.todoManagement.path,
                                        element: (
                                            <TodoManagementPage />
                                        )
                                    },
                                    {
                                        // タスク管理詳細
                                        path: paths.todoManagementDetail.path,
                                        element: (
                                            <TodoManagementDetailPage />
                                        )
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        // 権限ガード：deleted_task_management 権限なしは404
                        element: (
                            <RoleRoute
                                permission="deleted_task_management"
                            />
                        ),
                        children: [
                            {
                                element: <TodoLayout />,
                                children: [
                                    {
                                        // 削除タスク管理一覧
                                        path: paths.todoDeletedManagement.path,
                                        element: (
                                            <TodoDeletedManagementPage />
                                        )
                                    },
                                    {
                                        // 削除タスク管理詳細
                                        path: paths.todoDeletedManagementDetail.path,
                                        element: (
                                            <TodoDeletedManagementDetailPage />
                                        )
                                    }
                                ]
                            }
                        ]
                    },
                ]
            },
            {
                // ユーザー情報更新
                path: paths.updateUser.path,
                element: (
                    <UpdateUserContainer />
                )
            },
            {
                // パスワード更新
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
