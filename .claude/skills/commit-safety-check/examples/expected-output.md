# Expected Output — Pre-Commit Check

---

## ケース1: 要確認（機密ファイル混入）

### 状況
- `.dev.vars` が変更ファイルに含まれていた

### 出力

```
## Pre-Commit Check 結果

### 要確認
- **ファイル**: backend/.dev.vars
- **検出内容**: 機密ファイル（.dev.vars）が変更対象に含まれている
- **対応方針**: .gitignore に追加する。このファイルはコミットしない。
```

---

## ケース2: 要確認（ハードコードされた API キー）

### 状況
- ソースファイルに `sk-` で始まる文字列が追加されていた

### 出力

```
## Pre-Commit Check 結果

### 要確認
- **ファイル**: backend/src/lib/notification-client.ts:5
- **検出内容**: `sk-` で始まる文字列（API キーの可能性）がハードコードされている
- **対応方針**: 環境変数（.dev.vars）に移動し、コード上は `c.env.NOTIFICATION_API_KEY` 等で参照する
```

---

## ケース3: 要確認（手動マイグレーションファイル）

### 状況
- `drizzle/0007_add_task_archived_flag.sql` が新規ファイルとして追加されているが、`drizzle/meta/` に変更がない

### 出力

```
## Pre-Commit Check 結果

### 要確認
- **ファイル**: drizzle/0007_add_task_archived_flag.sql
- **検出内容**: `drizzle/meta/` のスナップショット（`_journal.json` / `*_snapshot.json`）が更新されておらず、手動作成の疑いがある
- **対応方針**: `npm run db:generate` で生成し直すか、`db:generate --custom` を使ってスナップショットを進める
```

---

## ケース4: 問題なし

### 出力

```
## Pre-Commit Check 結果

チェック完了。問題なし。
```
