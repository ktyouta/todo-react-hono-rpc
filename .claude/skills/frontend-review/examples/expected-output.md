# Expected Output — Frontend Review

---

## ケース1: 違反あり（Presentational に state が混入）

### 状況
- `todo-action-bar.tsx`（Presentational）内で `useState` を使っている

### 出力

```
## Frontend Review 結果

### 違反あり
- **ファイル**: frontend/src/features/todo/components/todo-action-bar.tsx:6
- **違反内容**: Presentational コンポーネントに `useState` が定義されている（state は Container が持つべき）
- **修正方針**: `useState` と関連ロジックを `todo-list-container.tsx` に移動し、値を props で受け取る
```

---

## ケース2: 違反あり（state 系変数にコメントなし）

### 状況
- `const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([])` にコメントがない

### 出力

```
## Frontend Review 結果

### 違反あり
- **ファイル**: frontend/src/features/todo/components/todo-list-container.tsx:9
- **違反内容**: `selectedTaskIds` に変数コメントがない（state 系変数は全件コメント必須）
- **修正方針**: `// 選択中のタスクID一覧` を前行に追加する
```

---

## ケース3: 違反あり（text-sm をボタンに使用）

### 状況
- ユーザーが能動的に操作するボタンに `text-sm` が使われている

### 出力

```
## Frontend Review 結果

### 違反あり
- **ファイル**: frontend/src/features/todo/components/todo-action-bar.tsx:22
- **違反内容**: ユーザーが操作するボタンに `text-sm` を使用している（`text-base` 以上が必要）
- **修正方針**: `text-sm` → `text-base` に変更する
```

---

## ケース4: 問題なし

### 出力

```
## Frontend Review 結果

チェック完了。問題なし。
```
