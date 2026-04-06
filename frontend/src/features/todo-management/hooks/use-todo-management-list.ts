import { paths } from "@/config/paths";
import { getCategory } from "@/features/api/get-category";
import { getPriority } from "@/features/api/get-priority";
import { getStatus } from "@/features/api/get-status";
import { getUserList } from "@/features/api/get-user-list";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useDelayedFlag } from "@/hooks/use-delayed-flag";
import { useTransitionSearchParams } from "@/hooks/use-transition-search-params";
import { useEffect, useRef, useState } from "react";
import { TaskManagementListReturnType, useGetTodoManagementList } from "../api/get-todo-management-list";
import { TODO_MANAGEMENT_QUERY_KEY } from "../constants/todo-management-query-params";
import { initialTodoManagementSearchFilter, TodoManagementSearchFilter } from "../types/todo-management-search-filter";
import { useTodoManagementBulk } from "./use-todo-management-bulk";

export function useTodoManagementList() {

    // クエリパラメータ取得用
    const [searchParams, setSearchParams, isPending] = useTransitionSearchParams();
    // 初期検索条件
    const initSearchCondition: TodoManagementSearchFilter = {
        userId: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.USER_ID) ?? '',
        title: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.TITLE) ?? '',
        categoryId: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.CATEGORY) ?? '',
        statusId: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.STATUS) ?? '',
        priorityId: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.PRIORITY) ?? '',
        dueDateFrom: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.DUE_DATE_FROM),
        dueDateTo: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.DUE_DATE_TO),
        createdAtFrom: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.CREATED_AT_FROM),
        createdAtTo: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.CREATED_AT_TO),
        updatedAtFrom: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.UPDATED_AT_FROM),
        updatedAtTo: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.UPDATED_AT_TO),
    };
    // タスク検索条件
    const [searchCondition, setSearchCondition] = useState<TodoManagementSearchFilter>(initSearchCondition);
    // 選択中のページ
    const pageParam = searchParams.get(TODO_MANAGEMENT_QUERY_KEY.PAGE);
    const currentPage = pageParam && !Number.isNaN(Number(pageParam)) ? Number(pageParam) : 1;
    // タスク一覧
    const { data } = useGetTodoManagementList({ searchParams });
    // ユーザーリスト
    const { data: users } = getUserList();
    // カテゴリリスト
    const { data: category } = getCategory();
    // ステータスリスト
    const { data: status } = getStatus();
    // 優先度リスト
    const { data: priority } = getPriority();
    // 一括操作
    const bulk = useTodoManagementBulk({
        taskData: data.data,
        categoryList: category.data,
        statusList: status.data,
        priorityList: priority.data,
    });
    // ルーティング用
    const { appNavigate } = useAppNavigation();
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
     * テーブルの行クリックイベント
     */
    function onRowClick(entry: TaskManagementListReturnType['list'][number]) {
        appNavigate(paths.todoManagementDetail.getHref(entry.id));
    }

    /**
     * 検索条件クリア
     */
    function clearSearchCondition() {
        setSearchCondition(initialTodoManagementSearchFilter);
        setSearchParams({});
    }

    /**
     * 検索ボタン押下イベント
     */
    function clickSearch() {
        const params: Record<string, string> = {};
        if (searchCondition.userId) {
            params[TODO_MANAGEMENT_QUERY_KEY.USER_ID] = searchCondition.userId;
        }
        if (searchCondition.title) {
            params[TODO_MANAGEMENT_QUERY_KEY.TITLE] = searchCondition.title;
        }
        if (searchCondition.categoryId) {
            params[TODO_MANAGEMENT_QUERY_KEY.CATEGORY] = searchCondition.categoryId;
        }
        if (searchCondition.statusId) {
            params[TODO_MANAGEMENT_QUERY_KEY.STATUS] = searchCondition.statusId;
        }
        if (searchCondition.priorityId) {
            params[TODO_MANAGEMENT_QUERY_KEY.PRIORITY] = searchCondition.priorityId;
        }
        if (searchCondition.dueDateFrom) {
            params[TODO_MANAGEMENT_QUERY_KEY.DUE_DATE_FROM] = searchCondition.dueDateFrom;
        }
        if (searchCondition.dueDateTo) {
            params[TODO_MANAGEMENT_QUERY_KEY.DUE_DATE_TO] = searchCondition.dueDateTo;
        }
        if (searchCondition.createdAtFrom) {
            params[TODO_MANAGEMENT_QUERY_KEY.CREATED_AT_FROM] = searchCondition.createdAtFrom;
        }
        if (searchCondition.createdAtTo) {
            params[TODO_MANAGEMENT_QUERY_KEY.CREATED_AT_TO] = searchCondition.createdAtTo;
        }
        if (searchCondition.updatedAtFrom) {
            params[TODO_MANAGEMENT_QUERY_KEY.UPDATED_AT_FROM] = searchCondition.updatedAtFrom;
        }
        if (searchCondition.updatedAtTo) {
            params[TODO_MANAGEMENT_QUERY_KEY.UPDATED_AT_TO] = searchCondition.updatedAtTo;
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
            params[TODO_MANAGEMENT_QUERY_KEY.PAGE] = page.toString();
        }
        else {
            delete params[TODO_MANAGEMENT_QUERY_KEY.PAGE];
        }
        setSearchParams(params);
        bulk.exitBulkMode();
    }

    return {
        taskData: data.data,
        onRowClick,
        userList: users.data,
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
