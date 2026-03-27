import { paths } from "@/config/paths";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useDelayedFlag } from "@/hooks/use-delayed-flag";
import { useTransitionSearchParams } from "@/hooks/use-transition-search-params";
import { useEffect, useRef, useState } from "react";
import { getRoleList } from "../../api/get-role-list";
import { useGetUserManagementList, UserManagementListReturnType } from "../api/get-user-management-list";
import { USER_MANAGEMENT_QUERY_KEY } from "../constants/user-management-query-params";
import { initialUserManagementSearchFilter, UserManagementSearchFilter } from "../types/user-management-search-filter";

export function useUserManagementList() {
    // URLクエリパラメータの読み書きと遷移中フラグ
    const [searchParams, setSearchParams, isPending] = useTransitionSearchParams();
    // URLから復元した初期検索条件
    const initSearchCondition: UserManagementSearchFilter = {
        name: searchParams.get(USER_MANAGEMENT_QUERY_KEY.NAME) ?? '',
        roleId: searchParams.get(USER_MANAGEMENT_QUERY_KEY.ROLE_ID) ?? '',
        createdAtFrom: searchParams.get(USER_MANAGEMENT_QUERY_KEY.CREATED_AT_FROM),
        createdAtTo: searchParams.get(USER_MANAGEMENT_QUERY_KEY.CREATED_AT_TO),
        updatedAtFrom: searchParams.get(USER_MANAGEMENT_QUERY_KEY.UPDATED_AT_FROM),
        updatedAtTo: searchParams.get(USER_MANAGEMENT_QUERY_KEY.UPDATED_AT_TO),
    };
    // 検索フォームの入力値（未確定）
    const [searchCondition, setSearchCondition] = useState<UserManagementSearchFilter>(initSearchCondition);
    // 現在のページ番号（URLから取得、デフォルト1）
    const pageParam = searchParams.get(USER_MANAGEMENT_QUERY_KEY.PAGE);
    const currentPage = pageParam && !Number.isNaN(Number(pageParam)) ? Number(pageParam) : 1;
    // ユーザー一覧データ
    const { data } = useGetUserManagementList({ searchParams });
    // ナビゲーション用
    const { appNavigate } = useAppNavigation();
    // ページ遷移時のローディングオーバーレイ表示フラグ（遅延付き）
    const isShowOverlay = useDelayedFlag(isPending, 250);
    // ページ変更かどうかを追跡するための ref（スクロールトップ制御用）
    const wasPageChanging = useRef(false);
    // ロール一覧
    const { data: role } = getRoleList();

    useEffect(() => {
        if (isPending) {
            wasPageChanging.current = true;
        } else if (wasPageChanging.current) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            wasPageChanging.current = false;
        }
    }, [isPending]);

    /**
     * 行クリック時に詳細画面へ遷移
     */
    function onRowClick(entry: UserManagementListReturnType['list'][number]) {
        appNavigate(paths.userManagementDetail.getHref(entry.id));
    }

    /**
     * 検索条件をリセットしてURLパラメータを削除
     */
    function clearSearchCondition() {
        setSearchCondition(initialUserManagementSearchFilter);
        setSearchParams({});
    }

    /**
     * 検索ボタン押下時にフォームの入力値をURLパラメータに反映
     */
    function clickSearch() {
        const params: Record<string, string> = {};
        if (searchCondition.name) {
            params[USER_MANAGEMENT_QUERY_KEY.NAME] = searchCondition.name;
        }
        if (searchCondition.roleId) {
            params[USER_MANAGEMENT_QUERY_KEY.ROLE_ID] = searchCondition.roleId;
        }
        if (searchCondition.createdAtFrom) {
            params[USER_MANAGEMENT_QUERY_KEY.CREATED_AT_FROM] = searchCondition.createdAtFrom;
        }
        if (searchCondition.createdAtTo) {
            params[USER_MANAGEMENT_QUERY_KEY.CREATED_AT_TO] = searchCondition.createdAtTo;
        }
        if (searchCondition.updatedAtFrom) {
            params[USER_MANAGEMENT_QUERY_KEY.UPDATED_AT_FROM] = searchCondition.updatedAtFrom;
        }
        if (searchCondition.updatedAtTo) {
            params[USER_MANAGEMENT_QUERY_KEY.UPDATED_AT_TO] = searchCondition.updatedAtTo;
        }
        setSearchParams(params);
    }

    /**
     * Enterキー押下時に検索を実行
     */
    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            clickSearch();
        }
    }

    /**
     * ページ番号変更時にURLパラメータを更新
     * @param page 遷移先のページ番号
     */
    function changePage(page: number) {
        const params = Object.fromEntries(searchParams);
        if (page > 1) {
            params[USER_MANAGEMENT_QUERY_KEY.PAGE] = page.toString();
        } else {
            delete params[USER_MANAGEMENT_QUERY_KEY.PAGE];
        }
        setSearchParams(params);
    }

    return {
        userData: data.data,
        onRowClick,
        searchCondition,
        setSearchCondition,
        clearSearchCondition,
        clickSearch,
        handleKeyPress,
        currentPage,
        changePage,
        isShowOverlay,
        roleList: role.data,
    };
}
