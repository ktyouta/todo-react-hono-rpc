import { Dashboard } from "@/components";
import { paths } from "@/config/paths";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../api/logout";
import { LoginUserContext, SetLoginUserContext } from "./login-user-provider";


// サイドバーメニューリスト
const navigationList = [
    {
        name: `ホーム`,
        icon: (
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z' />
            </svg>
        ),
        path: paths.todo.path,
    }
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