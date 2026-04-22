import { rpc } from "@/lib/rpc-client";
import { TODO_LIST_QUERY_KEY } from "../constants/todo-list-query-params";

export async function downloadTodoExport(searchParams: URLSearchParams): Promise<void> {
    const res = await rpc.api.v1["todo-export"].$get({
        query: {
            title: searchParams.get(TODO_LIST_QUERY_KEY.TITLE) || undefined,
            categoryId: searchParams.get(TODO_LIST_QUERY_KEY.CATEGORY) || undefined,
            statusId: searchParams.get(TODO_LIST_QUERY_KEY.STATUS) || undefined,
            priorityId: searchParams.get(TODO_LIST_QUERY_KEY.PRIORITY) || undefined,
            dueDateFrom: searchParams.get(TODO_LIST_QUERY_KEY.DUE_DATE_FROM) || undefined,
            dueDateTo: searchParams.get(TODO_LIST_QUERY_KEY.DUE_DATE_TO) || undefined,
            createdAtFrom: searchParams.get(TODO_LIST_QUERY_KEY.CREATED_AT_FROM) || undefined,
            createdAtTo: searchParams.get(TODO_LIST_QUERY_KEY.CREATED_AT_TO) || undefined,
            updatedAtFrom: searchParams.get(TODO_LIST_QUERY_KEY.UPDATED_AT_FROM) || undefined,
            updatedAtTo: searchParams.get(TODO_LIST_QUERY_KEY.UPDATED_AT_TO) || undefined,
            isFavorite: searchParams.get(TODO_LIST_QUERY_KEY.IS_FAVORITE) || undefined,
        },
    });

    if (!res.ok) {
        throw new Error("CSVエクスポートに失敗しました。時間をおいて再度お試しください。");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    const disposition = res.headers.get("Content-Disposition");
    const match = disposition?.match(/filename="(.+?)"/);
    const date = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
    a.download = match?.[1] ?? `tasks_${date}.csv`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
