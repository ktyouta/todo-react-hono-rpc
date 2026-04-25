import { rpc } from "@/lib/rpc-client";
import { InferResponseType } from "hono/client";

const endpoint = rpc.api.v1["todo-import"].$post;

export type ImportTodoResponseType = InferResponseType<typeof endpoint, 200>;

export async function importTodo(file: File): Promise<ImportTodoResponseType> {
    const res = await endpoint({ form: { file } });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    return res.json();
}
