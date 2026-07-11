# Expected Output — Feature Implementation

---

## ケース1: 全ステップの出力例（タスクへのコメント機能）

### Step 3 出力（設計確認・ユーザー確認）

```
## 設計確認

### バックエンド
- エンドポイント: POST /api/todo-comment
- Service メソッド: createComment(userId, taskId, content)
- Repository メソッド: insert(taskId, userId, content, createdAt)

### フロントエンド
- コンポーネント: TodoCommentFormContainer / TodoCommentForm
- hooks: useTodoCommentCreate

### 作成・変更ファイル一覧

| ファイルパス | レイヤー | 操作 |
|---|---|---|
| backend/src/api/todo-comment/controller/create-todo-comment.controller.ts | Controller | 新規 |
| backend/src/api/todo-comment/service/create-todo-comment.service.ts | Service | 新規 |
| backend/src/api/todo-comment/repository/create-todo-comment.repository.ts | Repository | 新規 |
| backend/src/api/todo-comment/repository/create-todo-comment.repository.interface.ts | Interface | 新規 |
| backend/src/api/todo-comment/schema/create-todo-comment.schema.ts | Schema | 新規 |
| frontend/src/features/todo/api/create-todo-comment.ts | API | 新規 |
| frontend/src/features/todo/api/query-key.ts | QueryKey | 変更 |
| frontend/src/features/todo/components/todo-comment-form-container.tsx | Container | 新規 |
| frontend/src/features/todo/components/todo-comment-form.tsx | Presentational | 新規 |
| frontend/src/features/todo/hooks/use-todo-comment-create.ts | Hook | 新規 |

### フォルダ構成チェック（CLAUDE.md 準拠）
- エンドポイント単位のファイル分割になっているか ✓
- repository に .interface.ts がセットで存在するか ✓
- Container に -container.tsx サフィックスがついているか ✓
- api/ に query-key.ts が含まれているか ✓
- components/ 配下がフラットになっているか ✓

問題がなければ実装に進みます。よろしいですか？
```

### Step 6 出力（バックエンド実装完了・ユーザー確認）

```
## バックエンド実装完了

### 変更ファイル
- backend/src/api/todo-comment/controller/create-todo-comment.controller.ts: POST /api/todo-comment エンドポイントを追加
- backend/src/api/todo-comment/service/create-todo-comment.service.ts: コメント作成サービスを実装
- backend/src/api/todo-comment/repository/create-todo-comment.repository.ts: INSERT 処理を実装

### 実装内容サマリー
- エンドポイント: POST /api/todo-comment
- Service メソッド: createComment(userId, taskId, content)
- Repository メソッド: insert(data)

### backend-review 結果
- 問題なし

確認できたら実装を続けます。よろしいですか？
```

---

## ケース2: レビューで NG が出た場合

### Step 8 出力（レビューで違反あり）

```
## Frontend Review 結果

### 違反あり
- **ファイル**: frontend/src/features/todo/components/todo-comment-form.tsx:6
- **違反内容**: Presentational コンポーネントに `useState` が定義されている
- **修正方針**: Container に移動する

→ 修正しました。

NG 累計: 1 件 → Step 11 で skill-gap-detector を必ず実行すること
```

### Step 11 出力（NG 対応後の skill-gap-detector）

```
## Skill Gap 検出結果

### NG 内容
- Presentational コンポーネントへの state 混入が frontend-review で検出できなかった（初回）

### 原因分類
- 分類: C（skill の問題ではない）
- 理由: frontend-review のチェック項目に「Presentational コンポーネントに state 管理が含まれていないか」は記載されている。今回は実装者の確認不足。

→ skill の修正は不要です。
```
