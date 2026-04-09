import { paths } from "@/config/paths";
import { getRoleList } from "@/features/api/get-role-list";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useDelayedFlag } from "@/hooks/use-delayed-flag";
import { useTransitionSearchParams } from "@/hooks/use-transition-search-params";
import { useEffect, useRef, useState } from "react";
import { UserDeletedManagementListReturnType, useGetUserDeletedManagementList } from "../api/get-user-deleted-management-list";
import { USER_DELETED_MANAGEMENT_QUERY_KEY } from "../constants/user-deleted-management-query-params";
import { initialUserDeletedManagementSearchFilter, UserDeletedManagementSearchFilter } from "../types/user-deleted-management-search-filter";
import { useUserDeletedManagementBulk } from "./use-user-deleted-management-bulk";

export function useUserDeletedManagementList() {

    // クエリパラメータ取得用
    const [searchParams, setSearchParams, isPending] = useTransitionSearchParams();

    // 初期検索条件
    const initSearchCondition: UserDeletedManagementSearchFilter = {
        name: searchParams.get(USER_DELETED_MANAGEMENT_QUERY_KEY.NAME) ?? '',
        roleId: searchParams.get(USER_DELETED_MANAGEMENT_QUERY_KEY.ROLE_ID) ?? '',
        createdAtFrom: searchParams.get(USER_DELETED_MANAGEMENT_QUERY_KEY.CREATED_AT_FROM),
        createdAtTo: searchParams.get(USER_DELETED_MANAGEMENT_QUERY_KEY.CREATED_AT_TO),
        updatedAtFrom: searchParams.get(USER_DELETED_MANAGEMENT_QUERY_KEY.UPDATED_AT_FROM),
        updatedAtTo: searchParams.get(USER_DELETED_MANAGEMENT_QUERY_KEY.UPDATED_AT_TO),
    };

    // ユーザー検索条件
    const [searchCondition, setSearchCondition] = useState<UserDeletedManagementSearchFilter>(initSearchCondition);
    // 選択中のページ
    const pageParam = searchParams.get(USER_DELETED_MANAGEMENT_QUERY_KEY.PAGE);
    const currentPage = pageParam && !Number.isNaN(Number(pageParam)) ? Number(pageParam) : 1;
    // 削除済みユーザー一覧
    const { data } = useGetUserDeletedManagementList({ searchParams });
    // ロールリスト
    const { data: roles } = getRoleList();
    // ルーティング用
    const { appNavigate } = useAppNavigation();
    // オーバーレイ表示フラグ
    const isShowOverlay = useDelayedFlag(isPending, 250);
    // 一括操作
    const bulk = useUserDeletedManagementBulk({ userData: data.data });
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
    function onRowClick(entry: UserDeletedManagementListReturnType['list'][number]) {
        appNavigate(paths.userDeletedManagementDetail.getHref(entry.id));
    }

    /**
     * 検索条件クリア
     */
    function clearSearchCondition() {
        setSearchCondition(initialUserDeletedManagementSearchFilter);
        setSearchParams({});
    }

    /**
     * 検索ボタン押下イベント
     */
    function clickSearch() {
        const params: Record<string, string> = {};
        if (searchCondition.name) {
            params[USER_DELETED_MANAGEMENT_QUERY_KEY.NAME] = searchCondition.name;
        }
        if (searchCondition.roleId) {
            params[USER_DELETED_MANAGEMENT_QUERY_KEY.ROLE_ID] = searchCondition.roleId;
        }
        if (searchCondition.createdAtFrom) {
            params[USER_DELETED_MANAGEMENT_QUERY_KEY.CREATED_AT_FROM] = searchCondition.createdAtFrom;
        }
        if (searchCondition.createdAtTo) {
            params[USER_DELETED_MANAGEMENT_QUERY_KEY.CREATED_AT_TO] = searchCondition.createdAtTo;
        }
        if (searchCondition.updatedAtFrom) {
            params[USER_DELETED_MANAGEMENT_QUERY_KEY.UPDATED_AT_FROM] = searchCondition.updatedAtFrom;
        }
        if (searchCondition.updatedAtTo) {
            params[USER_DELETED_MANAGEMENT_QUERY_KEY.UPDATED_AT_TO] = searchCondition.updatedAtTo;
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
            params[USER_DELETED_MANAGEMENT_QUERY_KEY.PAGE] = page.toString();
        }
        else {
            delete params[USER_DELETED_MANAGEMENT_QUERY_KEY.PAGE];
        }
        setSearchParams(params);
        bulk.exitBulkMode();
    }

    return {
        userData: data.data,
        onRowClick,
        roleList: roles.data,
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
