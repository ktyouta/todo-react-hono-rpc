# Expected Output — RPC Review

---

## ケース1: 違反あり（型アサーション）

### 状況
- フロントエンドで RPC レスポンスに `as TaskType` を使っている

### 出力

```
## RPC Review 結果

### 違反あり
- **ファイル**: frontend/src/features/todo/api/get-todo.ts:14
- **違反内容**: `as TaskType` による型アサーションを使用している
- **修正方針**: `InferResponseType<typeof rpc.api.todo.$get>` で型推論に置き換える
```

---

## ケース2: 違反あり（fetch 直呼び出し）

### 状況
- フロントエンドで `fetch('/api/todo')` を直接呼び出している

### 出力

```
## RPC Review 結果

### 違反あり
- **ファイル**: frontend/src/features/todo/api/get-todo.ts:8
- **違反内容**: `fetch` を直接使用している（rpc クライアント経由でない）
- **修正方針**: `rpc.api.todo.$get()` に置き換える
```

---

## ケース3: 違反あり（バックエンドの @/ エイリアス）

### 状況
- バックエンドのファイルに `@/domain/task-id` のインポートが追加されている

### 出力

```
## RPC Review 結果

### 違反あり
- **ファイル**: backend/src/api/todo/service/get-todo.service.ts:2
- **違反内容**: `@/` パスエイリアスを使用している（フロントエンドの tsconfig と競合する）
- **修正方針**: `../../../domain/task-id` のような相対パスに変更する
```

---

## ケース4: 問題なし

### 出力

```
## RPC Review 結果

チェック完了。問題なし。
```
