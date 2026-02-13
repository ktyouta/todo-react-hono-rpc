import { Dashboard } from "@/components";
import { paths } from "@/config/paths";
import { Outlet } from "react-router-dom";


export function DashboardContainer() {

    const navigationList = [
        {
            name: `ホーム`,
            path: paths.todo.path,
        }
    ];

    return (
        <Dashboard
            navigationList={navigationList}
        >
            <Outlet />
        </Dashboard>
    );
}