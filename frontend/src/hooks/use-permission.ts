import { LoginUserContext } from "@/app/components/login-user-provider";

export function usePermission(permission: string): boolean {
    const loginUser = LoginUserContext.useCtx();
    return loginUser?.permissions.includes(permission) ?? false;
}
