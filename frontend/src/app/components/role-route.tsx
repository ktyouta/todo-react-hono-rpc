import { NotFound } from "@/components";
import { Outlet } from "react-router-dom";
import { LoginUserContext } from "./login-user-provider";

type PropsType = {
    permission: string
}

export function RoleRoute(props: PropsType) {

    // ログインユーザー情報
    const loginUser = LoginUserContext.useCtx();

    if (!loginUser?.permissions.includes(props.permission)) {
        return (
            <NotFound />
        );
    }

    return (
        <Outlet />
    );
}