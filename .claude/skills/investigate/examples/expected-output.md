# expected-output

## ケース1: OK — 関連ファイルを全件読んでから回答する

### 状況
「`get-todo` エンドポイントでなぜ 401 が返るか調査して」と依頼された。

### 期待する出力

```
## 読み込んだファイル
- backend/src/api/todo/controller/get-todo.controller.ts
- backend/src/api/todo/service/get-todo.service.ts
- backend/src/api/todo/repository/get-todo.repository.ts
- backend/src/middleware/auth.middleware.ts
- backend/src/domain/front-user-id/front-user-id.ts

## 調査結果

### 原因
`auth.middleware.ts:34` で JWT 検証が失敗している。
`get-todo.controller.ts` はルーターに `authMiddleware` を適用しているが、
`front-user-id.ts` の `FrontUserId.of()` が受け取るトークン形式と不一致が発生している。

### 詳細
...
```

---

## ケース2: NG — 起点ファイルだけ読んで回答する

### 状況
「`get-todo` エンドポイントでなぜ 401 が返るか調査して」と依頼された。

### 期待しない出力（NG）

```
`get-todo.controller.ts` を確認しました。
controller 自体に問題はなさそうです。
middleware の設定を確認してみてください。
```

**NG の理由**: `auth.middleware.ts` や `front-user-id.ts` を読まずに回答している。
読み込んだファイルの一覧も記載されていない。

---

## ケース3: OK — 機能フォルダ全体を読んでから回答する

### 状況
「todo 機能のフロントエンドでどこがデータ取得を担っているか確認して」と依頼された。

### 期待する出力

```
## 読み込んだファイル
- frontend/src/features/todo/components/todo-page.tsx
- frontend/src/features/todo/components/todo-list-container.tsx
- frontend/src/features/todo/api/get-todo-list.ts
- frontend/src/features/todo/api/query-key.ts
- frontend/src/lib/rpc-client.ts

## 調査結果

データ取得の流れ：
1. `todo-list-container.tsx` が `get-todo-list.ts` の React Query フックを直接呼び出す
2. `get-todo-list.ts` が `query-key.ts` のクエリキーを使用する
3. `get-todo-list.ts` が `rpc-client.ts` の `rpc` 経由で API を呼ぶ

...
```

---

## ケース4: NG — Glob/Grep だけで回答する（ファイルを読んでいない）

### 状況
「todo 機能のフロントエンドでどこがデータ取得を担っているか確認して」と依頼された。

### 期待しない出力（NG）

```
Grep の結果、`get-todo-list.ts` が該当します。
このファイルがデータ取得を担っています。
```

**NG の理由**: ファイルを Read せず Grep 結果だけで回答している。
import チェーンの全体像が把握できていない。
