import { NotFound } from '@/components';
import { paths } from '@/config/paths';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export const routerList: { path: string, element: ReactNode }[] = [
    {
        path: paths.home.path,
        element: (
            <Navigate to={paths.login.path} replace />
        )
    },
    {
        path: `*`,
        element: <NotFound />
    }
];
