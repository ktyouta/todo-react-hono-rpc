import { paths } from "@/config/paths";
import { getCategory } from "@/features/api/get-category";
import { getPriority } from "@/features/api/get-priority";
import { getStatus } from "@/features/api/get-status";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TaskListReturnType, useGetTodoList } from "../api/get-todo-list";
import { TODO_LIST_QUERY_KEY } from "../constants/todo-list-query-params";
import { initialTodoSearchFilter, TodoSearchFilter } from "../types/todo-search-filter";

export function useTodoList() {

    // クエリパラメータ取得用
    const [searchParams, setSearchParams] = useSearchParams();
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
    };
    // タスク検索条件
    const [searchCondition, setSearchCondition] = useState<TodoSearchFilter>(initSearchCondition);
    // 選択中のページ
    const pageParam = searchParams.get(TODO_LIST_QUERY_KEY.PAGE);
    const currentPage = pageParam && !Number.isNaN(Number(pageParam)) ? Number(pageParam) : 1;
    // タスク一覧
    const { data, isFetching } = useGetTodoList({ searchParams });
    // カテゴリリスト
    const { data: category } = getCategory();
    // ステータスリスト
    const { data: status } = getStatus();
    // 優先度リスト
    const { data: priority } = getPriority();
    // ルーティング用
    const { appNavigate } = useAppNavigation();

    /**
     * テーブルの行クリックイベント
     * @param entry
     */
    function onRowClick(entry: TaskListReturnType['list'][number]) {
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
     * 検索ボタン押下イベント
     */
    function clickSearch() {
        const params: Record<string, string> = {};
        if (searchCondition.title) {
            params[TODO_LIST_QUERY_KEY.TITLE] = searchCondition.title;
        }
        if (searchCondition.categoryId) {
            params[TODO_LIST_QUERY_KEY.CATEGORY] = searchCondition.categoryId;
        }
        if (searchCondition.statusId) {
            params[TODO_LIST_QUERY_KEY.STATUS] = searchCondition.statusId;
        }
        if (searchCondition.priorityId) {
            params[TODO_LIST_QUERY_KEY.PRIORITY] = searchCondition.priorityId;
        }
        if (searchCondition.dueDateFrom) {
            params[TODO_LIST_QUERY_KEY.DUE_DATE_FROM] = searchCondition.dueDateFrom;
        }
        if (searchCondition.dueDateTo) {
            params[TODO_LIST_QUERY_KEY.DUE_DATE_TO] = searchCondition.dueDateTo;
        }
        if (searchCondition.createdAtFrom) {
            params[TODO_LIST_QUERY_KEY.CREATED_AT_FROM] = searchCondition.createdAtFrom;
        }
        if (searchCondition.createdAtTo) {
            params[TODO_LIST_QUERY_KEY.CREATED_AT_TO] = searchCondition.createdAtTo;
        }
        if (searchCondition.updatedAtFrom) {
            params[TODO_LIST_QUERY_KEY.UPDATED_AT_FROM] = searchCondition.updatedAtFrom;
        }
        if (searchCondition.updatedAtTo) {
            params[TODO_LIST_QUERY_KEY.UPDATED_AT_TO] = searchCondition.updatedAtTo;
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
    };

    /**
     * ページ切り替えイベント
     */
    function changePage(page: number) {
        const params = Object.fromEntries(searchParams);
        if (page > 1) {
            params[TODO_LIST_QUERY_KEY.PAGE] = page.toString();
        } else {
            delete params[TODO_LIST_QUERY_KEY.PAGE];
        }
        setSearchParams(params);
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
    };
}
