import { NotFound } from '@/components';
import { paths } from '@/config/paths';
import { LoginContainer } from '@/features/login/components/login-container';
import { RoleCreatePage } from '@/features/role-create/components/role-create-page';
import { RoleManagementDetailPage } from '@/features/role-management/components/role-management-detail-page';
import { RoleManagementLayout } from '@/features/role-management/components/role-management-layout';
import { RoleManagementPage } from '@/features/role-management/components/role-management-page';
import { SignupContainer } from '@/features/signup/components/signup-container';
import { TodoCreateContainer } from '@/features/todo-create/components/create-todo-container';
import { TodoDeletedManagementDetailPage } from '@/features/todo-deleted-management/components/todo-deleted-management-detail-page';
import { TodoDeletedManagementLayout } from '@/features/todo-deleted-management/components/todo-deleted-management-layout';
import { TodoDeletedManagementPage } from '@/features/todo-deleted-management/components/todo-deleted-management-page';
import { TodoManagementDetailPage } from '@/features/todo-management/components/todo-management-detail-page';
import { TodoManagementLayout } from '@/features/todo-management/components/todo-management-layout';
import { TodoManagementPage } from '@/features/todo-management/components/todo-management-page';
import { TodoDetailPage } from '@/features/todo/components/todo-detail-page';
import { TodoLayout } from '@/features/todo/components/todo-layout';
import { TodoPage } from '@/features/todo/components/todo-page';
import { UpdatePasswordContainer } from '@/features/updatepassword/components/update-password-container';
import { UpdateUserContainer } from '@/features/updateuser/components/update-user-container';
import { UserCreatePage } from '@/features/user-create/components/user-create-page';
import { UserDeletedManagementDetailPage } from '@/features/user-deleted-management/components/user-deleted-management-detail-page';
import { UserDeletedManagementLayout } from '@/features/user-deleted-management/components/user-deleted-management-layout';
import { UserDeletedManagementPage } from '@/features/user-deleted-management/components/user-deleted-management-page';
import { TodoTrashDetailPage } from '@/features/todo-trash/components/todo-trash-detail-page';
import { TodoTrashLayout } from '@/features/todo-trash/components/todo-trash-layout';
import { TodoTrashPage } from '@/features/todo-trash/components/todo-trash-page';
import { UserManagementDetailPage } from '@/features/user-management/components/user-management-detail-page';
import { UserManagementLayout } from '@/features/user-management/components/user-management-layout';
import { UserManagementPage } from '@/features/user-management/components/user-management-page';
import { DashboardPage } from '@/features/dashboard/components/dashboard-page';
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
                        // ダッシュボード
                        path: paths.dashboard.path,
                        element: (
                            <DashboardPage />
                        )
                    },
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
                                element: <TodoManagementLayout />,
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
                                element: <TodoDeletedManagementLayout />,
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
                    {
                        // 権限ガード：user_create 権限なしは404
                        element: (
                            <RoleRoute
                                permission="user_create"
                            />
                        ),
                        children: [
                            {
                                // ユーザー作成
                                path: paths.userCreate.path,
                                element: (
                                    <UserCreatePage />
                                )
                            }
                        ]
                    },
                    {
                        // 権限ガード：role_create 権限なしは404
                        element: (
                            <RoleRoute
                                permission="role_create"
                            />
                        ),
                        children: [
                            {
                                // ロール作成
                                path: paths.roleCreate.path,
                                element: (
                                    <RoleCreatePage />
                                )
                            }
                        ]
                    },
                    {
                        // 権限ガード：role_management 権限なしは404
                        element: (
                            <RoleRoute
                                permission="role_management"
                            />
                        ),
                        children: [
                            {
                                element: <RoleManagementLayout />,
                                children: [
                                    {
                                        // ロール管理一覧
                                        path: paths.roleManagement.path,
                                        element: (
                                            <RoleManagementPage />
                                        )
                                    },
                                    {
                                        // ロール管理詳細
                                        path: paths.roleManagementDetail.path,
                                        element: (
                                            <RoleManagementDetailPage />
                                        )
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        // 権限ガード：user_management 権限なしは404
                        element: (
                            <RoleRoute
                                permission="user_management"
                            />
                        ),
                        children: [
                            {
                                element: <UserManagementLayout />,
                                children: [
                                    {
                                        // ユーザー管理一覧
                                        path: paths.userManagement.path,
                                        element: (
                                            <UserManagementPage />
                                        )
                                    },
                                    {
                                        // ユーザー管理詳細
                                        path: paths.userManagementDetail.path,
                                        element: (
                                            <UserManagementDetailPage />
                                        )
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        // 権限ガード：deleted_user_management 権限なしは404
                        element: (
                            <RoleRoute
                                permission="deleted_user_management"
                            />
                        ),
                        children: [
                            {
                                element: <UserDeletedManagementLayout />,
                                children: [
                                    {
                                        // 削除ユーザー管理一覧
                                        path: paths.userDeletedManagement.path,
                                        element: (
                                            <UserDeletedManagementPage />
                                        )
                                    },
                                    {
                                        // 削除ユーザー管理詳細
                                        path: paths.userDeletedManagementDetail.path,
                                        element: (
                                            <UserDeletedManagementDetailPage />
                                        )
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        element: <TodoTrashLayout />,
                        children: [
                            {
                                // ゴミ箱一覧
                                path: paths.todoTrash.path,
                                element: (
                                    <TodoTrashPage />
                                )
                            },
                            {
                                // ゴミ箱詳細
                                path: paths.todoTrashDetail.path,
                                element: (
                                    <TodoTrashDetailPage />
                                )
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
