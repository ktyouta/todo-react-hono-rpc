import { rpc } from "@/lib/rpc-client";
import { InferResponseType } from "hono/client";

const endpoint = rpc.api.v1["todo-management-import"].$post;

export type ImportTodoManagementResponseType = InferResponseType<typeof endpoint, 200>;

export async function importTodoManagement(file: File): Promise<ImportTodoManagementResponseType> {
    const res = await endpoint({ form: { file } });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    return res.json();
}
