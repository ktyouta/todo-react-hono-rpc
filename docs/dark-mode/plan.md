# ダークモード対応（案A: ローカルストレージ版・ホーム画面限定）実装計画

## 概要

設定でダークモードに切り替えられる機能の第一段階として、ローカルストレージに保存する形でホーム画面（サイドバーの「ホーム」メニュー = `paths.todo.path` = `features/todo/` の一覧画面）限定の動作確認を行う。
`dark:` バリアントが実際に機能するかという技術的リスクを最小コストで検証することが目的。

**対象画面の確認事項**: `components/layouts/dashboard/dashboard.tsx`（サイドバー・ヘッダー・フッター）は全画面共通レイアウトのため、検証用トグルをここに置く場合はレイアウト自体も `dark:` 対応の対象に含む。`features/dashboard/`（統計情報画面、サイドバー上の別メニュー「ダッシュボード」）とは別物であり、今回は対象外。

**対象外**: DBスキーマ・API変更、ユーザー設定画面の本格構築、対象画面（ホーム＋共通レイアウト）以外への `dark:` 展開、検索バーの詳細フィルター内 DatePicker（折りたたみ・非常時表示のため今回はスコープ外）、一括操作系ダイアログ（`TodoBulkUpdateDialog` 等、操作しないと表示されないため）

---

## タスク一覧

### フロントエンド（バックエンド変更なし）

- [x] #1 Tailwind `darkMode: 'class'` 設定追加（`frontend/tailwind.config.js`）
- [x] #2 `ThemeProvider` 新設（`createCtx` 利用、localStorage初期値読込・変更時保存、`<html>` への `dark` クラス適用を `useEffect` で実施）（`frontend/src/app/components/theme-provider.tsx`）
- [x] #3 `App.tsx` に `ThemeProvider` を組み込み（`frontend/src/app/components/app.tsx`）
- [x] #4 共通レイアウトのユーザーメニューに検証用テーマ切り替えトグルを追加 + `dark:` バリアント対応（`frontend/src/components/layouts/dashboard/dashboard.tsx`、配線として `frontend/src/app/components/dashboard-container.tsx` も変更）
- [x] #5 ホーム画面（todo一覧）のPresentationalコンポーネントへ `dark:` バリアント追加
  - `frontend/src/features/todo/components/todo-list.tsx`
  - `frontend/src/features/todo/components/todo-card.tsx`
  - `frontend/src/features/todo/components/todo-search-bar.tsx`
  - `frontend/src/features/todo/components/todo-action-bar.tsx`
- [x] #6 ホーム画面が使用する共通UIコンポーネントへ `dark:` バリアント追加
  - `frontend/src/components/ui/table/table.tsx`
  - `frontend/src/components/ui/select/select.tsx`
  - `frontend/src/components/ui/textbox/textbox.tsx`
  - `frontend/src/components/ui/pagination/pagination.tsx`
  - `button.tsx` / `badge.tsx` / `checkbox.tsx` / `loading-overlay.tsx` / `scroll-to-top-button.tsx` / `pages/loading/loading.tsx` は調査の結果、ブランドカラー・半透明黒背景・ネイティブUIの `color-scheme` 依存のため変更不要と判断
- [ ] #7 動作確認（トグル操作でホーム画面・共通レイアウトの見た目が切り替わることをブラウザで確認）— `tsc --noEmit` によるコンパイル確認・devサーバー起動確認は完了。ブラウザでの実クリック確認は未実施（ユーザー確認待ち）
- [x] #8 追加修正（ユーザー確認で発覚した問題への対応）
  - `frontend/src/index.css`: `:root` の OS依存（`prefers-color-scheme`）な `color`/`background-color` を削除し、`body` の配色を `.dark` クラス連動のTailwindクラスに統一。`color-scheme` も `.dark` クラス連動に変更
  - `frontend/src/components/ui/table/table.tsx`: `TableCell` にデフォルト文字色（`dark:text-gray-100`）を追加し、個別に色指定していなかったセル（ID・タイトル・日付列等）の同化を解消
  - `frontend/src/components/layouts/dashboard/dashboard.tsx`: サイドバー（`bg-cyan-500`）に `dark:bg-cyan-900` を追加
- [x] #9 対応範囲拡大: ユーザー情報更新・パスワード更新画面（ユーザーメニューから遷移する主要画面のため追加）
  - `frontend/src/features/updateuser/components/update-user.tsx`
  - `frontend/src/features/updatepassword/components/update-password.tsx`
- [x] #10 対応範囲拡大: タスク詳細画面（閲覧・編集）＋サブタスクセクション
  - `frontend/src/features/todo/components/todo-detail-view.tsx`
  - `frontend/src/features/todo/components/todo-detail-edit.tsx`
  - `frontend/src/features/todo/components/subtask-section.tsx`
  - `frontend/src/features/todo/components/subtask-card.tsx`
  - 共通コンポーネント: `components/ui/breadcrumb`, `dialog`, `copy-button`, `textarea`, `date-picker`（入力欄のみ。react-datepickerのポップアップカレンダー自体のダーク対応はスコープ外）
- [x] #11 全画面への水平展開完了（約87ファイル、全て既存の色クラスへの `dark:` バリアント追加）
  - login, signup, todo-create, todo（残り: ツリー・サブタスク作成・一括操作/インポートダイアログ）
  - todo-management, todo-deleted-management, todo-trash（タスク管理系3系統）
  - user-management, user-deleted-management, user-create（ユーザー管理系3系統）
  - role-create, role-management
  - dashboard（統計画面）, admin-dashboard
  - 実装は5並列forkで実施。うち1グループ（todo-management、13ファイル）がforkの取り違えにより未実装だったため、後から手動で直接実装し補完
  - react-datepicker のポップアップカレンダー、`@xyflow/react`（タスクツリー表示）の `Background`/`Controls` は外部ライブラリ標準コンポーネントのためスコープ外
- [x] #12 見落とし修正: AIアシスタント（タスクチャット、全画面共通で表示される機能）
  - `frontend/src/components/ui/drawer/drawer.tsx`（共通コンポーネント、Dialogと同型だが対象リストに含め忘れていた）
  - `frontend/src/app/components/todo-chat-drawer.tsx`
- [x] #13 見落とし修正: `Drawer` の `sideClasses`（4方向の境界線）に色クラス（`dark:border-gray-700`）を追加。色未指定の `border-*` はTailwindのデフォルト色（薄いグレー）が使われ、ダークモードでは「白線」として浮いて見えていた

推奨着手順: #1 → #2 → #3 → #4 → #5, #6（並行可）→ #7

---

## 設計判断メモ

- `zustand` は未導入のため新規導入せず、既存の `LoginUserProvider`（`createCtx` + `useState`）と同じ Context パターンで `ThemeProvider` を実装する
- `stores/navigation-depth-store.ts` のようなモジュールスコープ変数管理はReactの再レンダリングをトリガーしないため、UI状態には不採用
- `<html>` 要素への `dark` クラス付け外しは `ThemeProvider` 内の1箇所（`useEffect`）に集約し、各コンポーネントでは動的なクラス名生成をしない（`dark:` バリアントは静的に記述する）
- 次段階（DB統合）では、`ThemeProvider` の値の取得元を localStorage から `loginUser.isDarkMode`（`LoginUserType`, RPC推論）に差し替える想定。切替ロジック（`classList.toggle`）自体は再利用できる見込み
- 共通UIコンポーネント（`components/ui/`）を対象に含めたのは、ホーム画面が直接利用しているため。ここでの対応は他画面への展開時にも再利用できる
