import { paths } from "@/config/paths";
import { getCategory } from "@/features/api/get-category";
import { getPriority } from "@/features/api/get-priority";
import { getStatus } from "@/features/api/get-status";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useDelayedFlag } from "@/hooks/use-delayed-flag";
import { useTransitionSearchParams } from "@/hooks/use-transition-search-params";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { downloadTodoExport } from "../api/get-todo-export";
import { TaskListDataType, TaskListResponseType, useGetTodoList } from "../api/get-todo-list";
import { todoKeys } from "../api/query-key";
import { useUpdateTodoFavoriteMutation } from "../api/update-todo-favorite";
import { TODO_LIST_QUERY_KEY } from "../constants/todo-list-query-params";
import { initialTodoSearchFilter, TodoSearchFilter } from "../types/todo-search-filter";
import { useTodoBulk } from "./use-todo-bulk";
import { useTodoImport } from "./use-todo-import";

export function useTodoList() {

    // クエリパラメータ取得用
    const [searchParams, setSearchParams, isPending] = useTransitionSearchParams();
    // 初期検索条件
    const initSearchCondition: TodoSearchFilter = {
        title: searchParams.get(TODO_LIST_QUERY_KEY.TITLE) ?? '',
        categoryId: searchParams.get(TODO_LIST_QUERY_KEY.CATEGORY) ?? '',
        statusId: searchParams.get(TODO_LIST_QUERY_KEY.STATUS) ?? '',
        priorityId: searchParams.get(TODO_LIST_QUERY_KEY.PRIORITY) ?? '',
        dueDateFrom: searchParams.get(TODO_LIST_QUERY_KEY.DUE_DATE_FROM),
        dueDateTo: searchParams.get(TODO_LIST_QUERY_KEY.DUE_DATE_TO),
        createdAtFrom: searchParams.get(TODO_LIST_QUERY_KEY.CREATED_AT_FROM),
        createdAtTo: searchParams.get(TODO_LIST_QUERY_KEY.CREATED_AT_TO),
        updatedAtFrom: searchParams.get(TODO_LIST_QUERY_KEY.UPDATED_AT_FROM),
        updatedAtTo: searchParams.get(TODO_LIST_QUERY_KEY.UPDATED_AT_TO),
        isFavorite: searchParams.get(TODO_LIST_QUERY_KEY.IS_FAVORITE) === `true`,
        sortId: searchParams.get(TODO_LIST_QUERY_KEY.SORT_ID) ?? '',
    };
    // タスク検索条件
    const [searchCondition, setSearchCondition] = useState<TodoSearchFilter>(initSearchCondition);
    // 選択中のページ
    const pageParam = searchParams.get(TODO_LIST_QUERY_KEY.PAGE);
    const currentPage = pageParam && !Number.isNaN(Number(pageParam)) ? Number(pageParam) : 1;
    // タスク一覧
    const { data } = useGetTodoList({ searchParams });
    // カテゴリリスト
    const { data: category } = getCategory();
    // ステータスリスト
    const { data: status } = getStatus();
    // 優先度リスト
    const { data: priority } = getPriority();
    // 一括操作
    const bulk = useTodoBulk({
        taskData: data.data,
        categoryList: category.data,
        statusList: status.data,
        priorityList: priority.data,
    });
    // ルーティング用
    const { appNavigate } = useAppNavigation();
    // QueryClientインスタンス
    const queryClient = useQueryClient();
    // お気に入りトグル用
    const updateFavoriteMutation = useUpdateTodoFavoriteMutation({
        // APIコール前の楽観的更新
        onMutate: async ({ id, isFavorite }) => {

            await queryClient.cancelQueries({ queryKey: todoKeys.lists() });

            const previousData = queryClient.getQueriesData<TaskListResponseType>({
                queryKey: todoKeys.lists(),
            });

            queryClient.setQueriesData<TaskListResponseType>(
                { queryKey: todoKeys.lists() },
                (prev) => {
                    if (!prev) {
                        return prev;
                    }
                    return {
                        ...prev,
                        data: {
                            ...prev.data,
                            list: prev.data.list.map((task) => {
                                return String(task.id) === id ? { ...task, isFavorite } : task
                            }),
                        },
                    };
                }
            );
            return { previousData };
        },
        onError: (context) => {
            // 失敗時はキャッシュから復元
            context?.previousData.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data);
            });
            toast.error('お気に入りの更新に失敗しました。時間をおいて再度お試しください。');
        },
    });
    // CSVインポート
    const todoImport = useTodoImport();
    // CSVエクスポート中フラグ
    const [isExporting, setIsExporting] = useState(false);
    // オーバーレイ表示フラグ
    const isShowOverlay = useDelayedFlag(isPending, 250);
    // ページ切り替え判定フラグ
    const wasPageChanging = useRef(false);

    // ページ切り替え完了後にページトップへスクロール
    useEffect(() => {
        if (isPending) {
            wasPageChanging.current = true;
        }
        else if (wasPageChanging.current) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            wasPageChanging.current = false;
        }
    }, [isPending]);

    /**
     * お気に入りトグルイベント
     */
    function onFavoriteToggle(entry: TaskListDataType['list'][number]) {
        updateFavoriteMutation.mutate({
            id: String(entry.id),
            isFavorite: !entry.isFavorite,
        });
    }

    /**
     * テーブルの行クリックイベント
     * @param entry
     */
    function onRowClick(entry: TaskListDataType['list'][number]) {
        appNavigate(`${paths.todoDetail.getHref(entry.id)}`);
    }

    /**
     * 検索条件クリア
     */
    function clearSearchCondition() {
        setSearchCondition(initialTodoSearchFilter);
        setSearchParams({});
    }

    /**
     * 検索条件からURLSearchParamsを構築
     */
    function buildSearchParams(condition: TodoSearchFilter): Record<string, string> {
        const params: Record<string, string> = {};
        if (condition.title) {
            params[TODO_LIST_QUERY_KEY.TITLE] = condition.title;
        }
        if (condition.categoryId) {
            params[TODO_LIST_QUERY_KEY.CATEGORY] = condition.categoryId;
        }
        if (condition.statusId) {
            params[TODO_LIST_QUERY_KEY.STATUS] = condition.statusId;
        }
        if (condition.priorityId) {
            params[TODO_LIST_QUERY_KEY.PRIORITY] = condition.priorityId;
        }
        if (condition.dueDateFrom) {
            params[TODO_LIST_QUERY_KEY.DUE_DATE_FROM] = condition.dueDateFrom;
        }
        if (condition.dueDateTo) {
            params[TODO_LIST_QUERY_KEY.DUE_DATE_TO] = condition.dueDateTo;
        }
        if (condition.createdAtFrom) {
            params[TODO_LIST_QUERY_KEY.CREATED_AT_FROM] = condition.createdAtFrom;
        }
        if (condition.createdAtTo) {
            params[TODO_LIST_QUERY_KEY.CREATED_AT_TO] = condition.createdAtTo;
        }
        if (condition.updatedAtFrom) {
            params[TODO_LIST_QUERY_KEY.UPDATED_AT_FROM] = condition.updatedAtFrom;
        }
        if (condition.updatedAtTo) {
            params[TODO_LIST_QUERY_KEY.UPDATED_AT_TO] = condition.updatedAtTo;
        }
        if (condition.isFavorite) {
            params[TODO_LIST_QUERY_KEY.IS_FAVORITE] = `true`;
        }
        if (condition.sortId) {
            params[TODO_LIST_QUERY_KEY.SORT_ID] = condition.sortId;
        }
        return params;
    }

    /**
     * 検索ボタン押下イベント
     */
    function clickSearch() {
        setSearchParams(buildSearchParams(searchCondition));
    }

    /**
     * 並び替え変更イベント（即時反映）
     */
    function onSortChange(sortId: string) {
        const newCondition = { ...searchCondition, sortId };
        setSearchCondition(newCondition);
        setSearchParams(buildSearchParams(newCondition));
    }

    /**
     * CSVエクスポートイベント
     */
    async function onExport() {
        setIsExporting(true);
        try {
            await downloadTodoExport(searchParams);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'CSVエクスポートに失敗しました。時間をおいて再度お試しください。';
            toast.error(message);
        } finally {
            setIsExporting(false);
        }
    }

    /**
     * エンターキー押下時イベント
     */
    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            clickSearch();
        }
    };

    /**
     * ページ切り替えイベント
     */
    function changePage(page: number) {
        const params = Object.fromEntries(searchParams);
        if (page > 1) {
            params[TODO_LIST_QUERY_KEY.PAGE] = page.toString();
        }
        else {
            delete params[TODO_LIST_QUERY_KEY.PAGE];
        }
        setSearchParams(params);
        bulk.exitBulkMode();
    }

    return {
        taskData: data.data,
        onRowClick,
        onFavoriteToggle,
        categoryList: category.data,
        statusList: status.data,
        priorityList: priority.data,
        searchCondition,
        setSearchCondition,
        clearSearchCondition,
        clickSearch,
        handleKeyPress,
        currentPage,
        changePage,
        isShowOverlay,
        bulk,
        onExport,
        isExporting,
        todoImport,
        onSortChange,
    };
}
