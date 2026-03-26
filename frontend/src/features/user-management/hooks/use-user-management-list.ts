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
    const [searchParams, setSearchParams, isPending] = useTransitionSearchParams();
    const initSearchCondition: UserManagementSearchFilter = {
        name: searchParams.get(USER_MANAGEMENT_QUERY_KEY.NAME) ?? '',
        roleId: searchParams.get(USER_MANAGEMENT_QUERY_KEY.ROLE_ID) ?? '',
        createdAtFrom: searchParams.get(USER_MANAGEMENT_QUERY_KEY.CREATED_AT_FROM),
        createdAtTo: searchParams.get(USER_MANAGEMENT_QUERY_KEY.CREATED_AT_TO),
        updatedAtFrom: searchParams.get(USER_MANAGEMENT_QUERY_KEY.UPDATED_AT_FROM),
        updatedAtTo: searchParams.get(USER_MANAGEMENT_QUERY_KEY.UPDATED_AT_TO),
    };
    const [searchCondition, setSearchCondition] = useState<UserManagementSearchFilter>(initSearchCondition);
    const pageParam = searchParams.get(USER_MANAGEMENT_QUERY_KEY.PAGE);
    const currentPage = pageParam && !Number.isNaN(Number(pageParam)) ? Number(pageParam) : 1;
    const { data } = useGetUserManagementList({ searchParams });
    const { appNavigate } = useAppNavigation();
    const isShowOverlay = useDelayedFlag(isPending, 250);
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

    function onRowClick(entry: UserManagementListReturnType['list'][number]) {
        appNavigate(paths.userManagementDetail.getHref(entry.id));
    }

    function clearSearchCondition() {
        setSearchCondition(initialUserManagementSearchFilter);
        setSearchParams({});
    }

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

    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            clickSearch();
        }
    }

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
