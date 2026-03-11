// todo一覧画面のクエリパラメータ
export const TODO_LIST_QUERY_KEY = {
    // タイトル
    TITLE: `title`,
    // カテゴリ
    CATEGORY: `category`,
    // ステータス
    STATUS: `status`,
    // 優先度
    PRIORITY: `priority`,
    // 期限日(FROM)
    DUE_DATE_FROM: `dueDateFrom`,
    // 期限日(TO)
    DUE_DATE_TO: `dueDateTo`,
    // 登録日(FROM)
    CREATED_AT_FROM: `createdAtFrom`,
    // 登録日(TO)
    CREATED_AT_TO: `createdAtTo`,
    // 更新日(FROM)
    UPDATED_AT_FROM: `updatedAtFrom`,
    // 更新日(TO)
    UPDATED_AT_TO: `updatedAtTo`,
} as const;
