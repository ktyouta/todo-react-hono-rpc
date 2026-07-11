# Expected Output — Spec Review

---

## ケース1: 仕様との差分あり

### 状況
- `docs/todo-comment/plan.md` に「コメントは1タスクあたり最大50件まで登録できる」と書かれているが、上限チェックがない実装になっている

### 出力

```
## 仕様突き合わせ結果

### 実装済み（仕様通り）
- コメント入力フォームの表示: frontend/src/features/todo/components/todo-comment-form.tsx:15
- 送信後のコメント一覧再取得: frontend/src/features/todo/components/todo-comment-form-container.tsx:34

### 未実装
- なし

### 仕様と異なる実装
- コメント登録件数の上限
  - 仕様: 1タスクあたり最大50件まで登録可能、超過時はエラーを返す
  - 実装: backend/src/api/todo-comment/service/create-todo-comment.service.ts:22 に上限チェックが存在しない
  - 差分の概要: 上限を超えても登録できてしまう
```

---

## ケース2: 未実装項目あり

### 状況
- `docs/dashboard/plan.md` に「期限超過タスクを警告カードで表示する」と書かれているが実装されていない

### 出力

```
## 仕様突き合わせ結果

### 実装済み（仕様通り）
- タスク集計データの取得: frontend/src/features/dashboard/api/get-dashboard-stats.ts:8

### 未実装
- 期限超過タスクの警告カード表示: 対応するコンポーネントが確認できない

### 仕様と異なる実装
- なし
```

---

## ケース3: 仕様通り

### 出力

```
## 仕様突き合わせ結果

チェック完了。仕様通りに実装されています。
```
