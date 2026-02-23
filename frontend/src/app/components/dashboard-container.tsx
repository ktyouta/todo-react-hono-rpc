import { Dashboard } from "@/components";
import { paths } from "@/config/paths";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineDocumentPlus, HiOutlineHome } from 'react-icons/hi2';
import { useLogoutMutation } from "../api/logout";
import { LoginUserContext, SetLoginUserContext } from "./login-user-provider";


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
];

export function DashboardContainer() {
    // ログインユーザー情報
    const loginUser = LoginUserContext.useCtx();
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