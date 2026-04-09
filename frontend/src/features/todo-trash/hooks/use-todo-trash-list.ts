import { paths } from "@/config/paths";
import { getCategory } from "@/features/api/get-category";
import { getPriority } from "@/features/api/get-priority";
import { getStatus } from "@/features/api/get-status";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useDelayedFlag } from "@/hooks/use-delayed-flag";
import { useTransitionSearchParams } from "@/hooks/use-transition-search-params";
import { useEffect, useRef, useState } from "react";
import { TodoTrashListReturnType, useGetTodoTrashList } from "../api/get-todo-trash-list";
import { TODO_TRASH_QUERY_KEY } from "../constants/todo-trash-query-params";
import { initialTodoTrashSearchFilter, TodoTrashSearchFilter } from "../types/todo-trash-search-filter";
import { useTodoTrashBulk } from "./use-todo-trash-bulk";

export function useTodoTrashList() {

    // クエリパラメータ取得用
    const [searchParams, setSearchParams, isPending] = useTransitionSearchParams();
    // 初期検索条件
    const initSearchCondition: TodoTrashSearchFilter = {
        title: searchParams.get(TODO_TRASH_QUERY_KEY.TITLE) ?? '',
        categoryId: searchParams.get(TODO_TRASH_QUERY_KEY.CATEGORY) ?? '',
        statusId: searchParams.get(TODO_TRASH_QUERY_KEY.STATUS) ?? '',
        priorityId: searchParams.get(TODO_TRASH_QUERY_KEY.PRIORITY) ?? '',
        dueDateFrom: searchParams.get(TODO_TRASH_QUERY_KEY.DUE_DATE_FROM),
        dueDateTo: searchParams.get(TODO_TRASH_QUERY_KEY.DUE_DATE_TO),
        updatedAtFrom: searchParams.get(TODO_TRASH_QUERY_KEY.UPDATED_AT_FROM),
        updatedAtTo: searchParams.get(TODO_TRASH_QUERY_KEY.UPDATED_AT_TO),
    };
    // タスク検索条件
    const [searchCondition, setSearchCondition] = useState<TodoTrashSearchFilter>(initSearchCondition);
    // 選択中のページ
    const pageParam = searchParams.get(TODO_TRASH_QUERY_KEY.PAGE);
    const currentPage = pageParam && !Number.isNaN(Number(pageParam)) ? Number(pageParam) : 1;
    // ゴミ箱タスク一覧
    const { data } = useGetTodoTrashList({ searchParams });
    // カテゴリリスト
    const { data: category } = getCategory();
    // ステータスリスト
    const { data: status } = getStatus();
    // 優先度リスト
    const { data: priority } = getPriority();
    // ルーティング用
    const { appNavigate } = useAppNavigation();
    // オーバーレイ表示フラグ
    const isShowOverlay = useDelayedFlag(isPending, 250);
    // 一括操作
    const bulk = useTodoTrashBulk({ taskData: data.data });
    // ページ切り替え判定フラグ
    const wasPageChanging = useRef(false);

    // ページ切り替え完了後にページトップへスクロール
    useEffect(() => {
        if (isPending) {
            wasPageChanging.current = true;
        } else if (wasPageChanging.current) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            wasPageChanging.current = false;
        }
    }, [isPending]);

    /**
     * テーブルの行クリックイベント
     */
    function onRowClick(entry: TodoTrashListReturnType['list'][number]) {
        appNavigate(paths.todoTrashDetail.getHref(entry.id));
    }

    /**
     * 検索条件クリア
     */
    function clearSearchCondition() {
        setSearchCondition(initialTodoTrashSearchFilter);
        setSearchParams({});
    }

    /**
     * 検索ボタン押下イベント
     */
    function clickSearch() {
        const params: Record<string, string> = {};
        if (searchCondition.title) {
            params[TODO_TRASH_QUERY_KEY.TITLE] = searchCondition.title;
        }
        if (searchCondition.categoryId) {
            params[TODO_TRASH_QUERY_KEY.CATEGORY] = searchCondition.categoryId;
        }
        if (searchCondition.statusId) {
            params[TODO_TRASH_QUERY_KEY.STATUS] = searchCondition.statusId;
        }
        if (searchCondition.priorityId) {
            params[TODO_TRASH_QUERY_KEY.PRIORITY] = searchCondition.priorityId;
        }
        if (searchCondition.dueDateFrom) {
            params[TODO_TRASH_QUERY_KEY.DUE_DATE_FROM] = searchCondition.dueDateFrom;
        }
        if (searchCondition.dueDateTo) {
            params[TODO_TRASH_QUERY_KEY.DUE_DATE_TO] = searchCondition.dueDateTo;
        }
        if (searchCondition.updatedAtFrom) {
            params[TODO_TRASH_QUERY_KEY.UPDATED_AT_FROM] = searchCondition.updatedAtFrom;
        }
        if (searchCondition.updatedAtTo) {
            params[TODO_TRASH_QUERY_KEY.UPDATED_AT_TO] = searchCondition.updatedAtTo;
        }
        setSearchParams(params);
    }

    /**
     * エンターキー押下時イベント
     */
    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            clickSearch();
        }
    }

    /**
     * ページ切り替えイベント
     */
    function changePage(page: number) {
        const params = Object.fromEntries(searchParams);
        if (page > 1) {
            params[TODO_TRASH_QUERY_KEY.PAGE] = page.toString();
        }
        else {
            delete params[TODO_TRASH_QUERY_KEY.PAGE];
        }
        setSearchParams(params);
        bulk.exitBulkMode();
    }

    return {
        taskData: data.data,
        onRowClick,
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
    };
}
