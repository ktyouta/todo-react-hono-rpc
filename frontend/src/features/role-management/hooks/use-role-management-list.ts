import { paths } from "@/config/paths";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useDelayedFlag } from "@/hooks/use-delayed-flag";
import { useTransitionSearchParams } from "@/hooks/use-transition-search-params";
import { useEffect, useRef, useState } from "react";
import { useGetRoleManagementList, RoleManagementListReturnType } from "../api/get-role-management-list";
import { ROLE_MANAGEMENT_QUERY_KEY } from "../constants/role-management-query-params";
import { initialRoleManagementSearchFilter, RoleManagementSearchFilter } from "../types/role-management-search-filter";

export function useRoleManagementList() {
    // URLクエリパラメータの読み書きと遷移中フラグ
    const [searchParams, setSearchParams, isPending] = useTransitionSearchParams();
    // URLから復元した初期検索条件
    const initSearchCondition: RoleManagementSearchFilter = {
        name: searchParams.get(ROLE_MANAGEMENT_QUERY_KEY.NAME) ?? '',
    };
    // 検索フォームの入力値（未確定）
    const [searchCondition, setSearchCondition] = useState<RoleManagementSearchFilter>(initSearchCondition);
    // 現在のページ番号（URLから取得、デフォルト1）
    const pageParam = searchParams.get(ROLE_MANAGEMENT_QUERY_KEY.PAGE);
    const currentPage = pageParam && !Number.isNaN(Number(pageParam)) ? Number(pageParam) : 1;
    // ロール一覧データ
    const { data } = useGetRoleManagementList({ searchParams });
    // ナビゲーション用
    const { appNavigate } = useAppNavigation();
    // ページ遷移時のローディングオーバーレイ表示フラグ（遅延付き）
    const isShowOverlay = useDelayedFlag(isPending, 250);
    // ページ変更かどうかを追跡するための ref（スクロールトップ制御用）
    const wasPageChanging = useRef(false);

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
    function onRowClick(entry: RoleManagementListReturnType['list'][number]) {
        appNavigate(paths.roleManagementDetail.getHref(entry.id));
    }

    /**
     * 検索条件をリセットしてURLパラメータを削除
     */
    function clearSearchCondition() {
        setSearchCondition(initialRoleManagementSearchFilter);
        setSearchParams({});
    }

    /**
     * 検索ボタン押下時にフォームの入力値をURLパラメータに反映
     */
    function clickSearch() {
        const params: Record<string, string> = {};
        if (searchCondition.name) {
            params[ROLE_MANAGEMENT_QUERY_KEY.NAME] = searchCondition.name;
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
            params[ROLE_MANAGEMENT_QUERY_KEY.PAGE] = page.toString();
        } else {
            delete params[ROLE_MANAGEMENT_QUERY_KEY.PAGE];
        }
        setSearchParams(params);
    }

    return {
        roleData: data.data,
        onRowClick,
        searchCondition,
        setSearchCondition,
        clearSearchCondition,
        clickSearch,
        handleKeyPress,
        currentPage,
        changePage,
        isShowOverlay,
    };
}
