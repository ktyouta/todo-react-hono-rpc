import { paths } from '@/config/paths';
import { LoginContainer } from '@/features/login/components/login-container';
import { SignupContainer } from '@/features/signup/components/signup-container';
import { ReactNode } from 'react';

export const guestRouterList: { path: string, element: ReactNode }[] = [
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
    }
];