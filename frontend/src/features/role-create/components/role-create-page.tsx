import { Loading } from "@/components";
import { Suspense } from "react";
import { RoleCreateContainer } from "./role-create-container";

export function RoleCreatePage() {
    return (
        <Suspense fallback={<Loading fullScreen={false} className="w-full min-h-full" />}>
            <RoleCreateContainer />
        </Suspense>
    );
}
