# Expected Output — Architecture Review

---

## ケース1: 違反あり

### 状況
- 「タスク一覧を取得する API を追加して」と依頼された
- 実装中に「将来的に使えそう」という理由でフィルタリング機能も追加した

### 出力

```
## Architecture Review 結果

### 違反あり
- **ファイル**: backend/src/api/todo/controller/get-todo-list.controller.ts:24
- **違反内容**: 指示にない `?status=active` クエリパラメータによるフィルタリング機能が追加されている
- **修正方針**: フィルタリング関連のコードを削除し、タスク一覧取得のみに絞る
```

---

## ケース2: 問題なし

### 状況
- 実装がユーザーの指示範囲内に収まっている

### 出力

```
## Architecture Review 結果

チェック完了。問題なし。
```
