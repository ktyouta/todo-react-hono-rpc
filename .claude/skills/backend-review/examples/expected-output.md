# Expected Output — Backend Review

---

## ケース1: 違反あり（Controller にビジネスロジック）

### 状況
- Controller 内で条件分岐・データ変換を直接行っている

### 出力

```
## Backend Review 結果

### 違反あり
- **ファイル**: backend/src/api/todo/controller/create-todo.controller.ts:18
- **違反内容**: 「期限切れタスクかどうか」の判定ロジックが Controller に直書きされている
- **修正方針**: Service メソッド `checkOverdue()` に切り出し、Controller は呼び出し結果で分岐する
```

---

## ケース2: 違反あり（Repository がエンドポイント単位でまとまっていない）

### 状況
- `get-todo.repository.ts`（SELECT）と `create-todo.repository.ts`（INSERT）に分かれている

### 出力

```
## Backend Review 結果

### 違反あり
- **ファイル**: backend/src/api/todo/repository/
- **違反内容**: Repository が操作種別（SELECT / INSERT）でファイル分割されている
- **修正方針**: `create-todo.repository.ts` に SELECT / INSERT をまとめ、`get-todo.repository.ts` は削除する
```

---

## ケース3: 違反あり（JSDoc が単行形式）

### 状況
- Service メソッドのコメントが `/** 説明 */` の1行形式になっている

### 出力

```
## Backend Review 結果

### 違反あり
- **ファイル**: backend/src/api/todo/service/create-todo.service.ts:10
- **違反内容**: JSDoc が単行形式（`/** 説明 */`）になっている。`@param` / `@returns` を含む複数行形式が必要
- **修正方針**: 以下の形式に変更する
  ```ts
  /**
   * 説明
   * @param userId
   * @returns
   */
  ```
```

---

## ケース4: 問題なし

### 出力

```
## Backend Review 結果

チェック完了。問題なし。
```
