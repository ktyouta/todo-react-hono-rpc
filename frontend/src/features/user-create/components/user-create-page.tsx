import { Loading } from "@/components";
import { Suspense } from "react";
import { UserCreateContainer } from "./user-create-container";

export function UserCreatePage() {
    return (
        <Suspense fallback={<Loading />}>
            <UserCreateContainer />
        </Suspense>
    );
}
