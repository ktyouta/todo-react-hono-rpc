# Expected Output — Detect Recurring Feedback

---

## ケース1: 複数の recurring pattern を検出

### 状況
- 過去の会話で「state 系変数にコメントを付けて」「マジックナンバーを定数化して」が複数回発生している
- Repository ファイルを操作種別で分けてしまうミスも毎回指摘されている

### 出力

```
## Recurring Feedback Analysis

### 検出ルール

| # | パターン | 発生回数 | 分類 |
|---|---|---|---|
| 1 | `useState` 等の state 系変数にコメントが付いていない | 3回 | コメント規約 |
| 2 | マジックナンバーが名前付き定数に切り出されていない | 3回 | コーディング規約 |
| 3 | Repository が操作種別（SELECT / INSERT）でファイル分割されている | 2回 | バックエンド設計規約 |

### 推奨アクション

| 対象 Skill | アクション |
|---|---|
| `frontend-review` | state 系変数のコメント漏れチェックを強化 |
| `backend-review` | マジックナンバー禁止のチェック項目を強化 |
| `backend-review` | Repository のエンドポイント単位集約チェックに具体例を追加 |

### 改善理由
- 3つのパターンはすべて2〜3回以上繰り返されており、Skill 化の基準（3回以上）を満たすものが2件ある
- `frontend-review` / `backend-review` のチェックで検出できていないため、チェック項目の追加が有効
```

---

## ケース2: 単発指摘のみで recurring pattern なし

### 出力

```
## Recurring Feedback Analysis

### 検出ルール
- 繰り返しパターンは検出されませんでした（各指摘は1回のみ）

### 推奨アクション
- なし（単発指摘は Skill 化しない）
```
