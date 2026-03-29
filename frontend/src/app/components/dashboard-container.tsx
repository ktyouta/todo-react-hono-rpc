import { Dashboard } from "@/components";
import { paths } from "@/config/paths";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { usePermission } from "@/hooks/use-permission";
import { HiOutlineArchiveBoxXMark, HiOutlineClipboardDocumentList, HiOutlineDocumentPlus, HiOutlineHome, HiOutlineUser, HiOutlineUserMinus, HiOutlineUserPlus } from 'react-icons/hi2';
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../api/logout";
import { LoginUserContext, SetLoginUserContext } from "./login-user-provider";

export function DashboardContainer() {
    // ログインユーザー情報
    const loginUser = LoginUserContext.useCtx();
    // タスク管理パーミッション
    const hasTaskManagement = usePermission('task_management');
    // 削除タスク管理パーミッション
    const hasDeletedTaskManagement = usePermission('deleted_task_management');
    // ユーザー作成パーミッション
    const hasUserCreate = usePermission('user_create');
    // ユーザー管理パーミッション
    const hasUserManagement = usePermission('user_management');
    // 削除ユーザー管理パーミッション
    const hasDeletedUserManagement = usePermission('deleted_user_management');

    // サイドバーメニューリスト
    const navigationList = [
        {
            name: `ホーム`,
            icon: <HiOutlineHome className='h-5 w-5' />,
            path: paths.todo.path,
        },
        {
            name: `タスク作成`,
            icon: <HiOutlineDocumentPlus className='h-5 w-5' />,
            path: paths.todoCreate.path,
        },
        ...(hasTaskManagement ? [{
            name: `タスク管理`,
            icon: <HiOutlineClipboardDocumentList className='h-5 w-5' />,
            path: paths.todoManagement.path,
        }] : []),
        ...(hasDeletedTaskManagement ? [{
            name: `削除タスク管理`,
            icon: <HiOutlineArchiveBoxXMark className='h-5 w-5' />,
            path: paths.todoDeletedManagement.path,
        }] : []),
        ...(hasUserCreate ? [{
            name: `ユーザー作成`,
            icon: <HiOutlineUserPlus className='h-5 w-5' />,
            path: paths.userCreate.path,
        }] : []),
        ...(hasUserManagement ? [{
            name: `ユーザー管理`,
            icon: <HiOutlineUser className='h-5 w-5' />,
            path: paths.userManagement.path,
        }] : []),
        ...(hasDeletedUserManagement ? [{
            name: `削除ユーザー管理`,
            icon: <HiOutlineUserMinus className='h-5 w-5' />,
            path: paths.userDeletedManagement.path,
        }] : []),
    ];
    // ログインユーザー情報(setter)
    const setLoginUser = SetLoginUserContext.useCtx();
    // ルーティング用
    const { appNavigate } = useAppNavigation();
    // ログアウトリクエスト
    const mutation = useLogoutMutation({
        onSuccess: function (): void {
            setLoginUser(null);
            appNavigate(paths.login.path);
        },
        onError: function (): void {
            toast.error(`ログアウトに失敗しました。時間をおいて再度お試しください。`)
        }
    });

    if (!loginUser) {
        return (
            <Navigate
                to={paths.login.getHref(location.pathname)}
                replace
            />
        );
    }

    // ユーザー情報更新画面遷移
    function moveUserInfoUpdate() {
        appNavigate(paths.updateUser.path);
    }

    // パスワード更新画面遷移
    function movePasswordUpdate() {
        appNavigate(paths.updatePassword.path);
    }

    // ログアウト
    function logout() {
        mutation.mutate();
    }

    return (
        <Dashboard
            navigationList={navigationList}
            loginUser={loginUser}
            moveUserInfoUpdate={moveUserInfoUpdate}
            movePasswordUpdate={movePasswordUpdate}
            logout={logout}
        >
            <Outlet />
        </Dashboard>
    );
}