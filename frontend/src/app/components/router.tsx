import { useRoutes } from 'react-router-dom';
import { guestRouterList } from '../routes/guest-router-list';
import { protectedRouterList } from '../routes/protected-router-list';
import { routerList } from '../routes/router-list';
import { GuestRoute } from './guest-route';
import { ProtectedRoute } from './protected-route';


export const AppRouter = () => {
    const router = useRoutes([
        ...routerList,
        ...guestRouterList.map((item) => {
            return (
                {
                    path: item.path,
                    element: (
                        <GuestRoute>
                            {item.element}
                        </GuestRoute>
                    )
                }
            )
        }),
        ...protectedRouterList.map((item) => {
            return (
                {
                    path: item.path,
                    element: (
                        <ProtectedRoute>
                            {item.element}
                        </ProtectedRoute>
                    )
                }
            )
        })
    ]);
    return router;
};
