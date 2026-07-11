# Expected Output — Resource Authorization Review

---

## ケース1: パスパラメータの userId を照合なしで使用（NG）

### 状況
`PATCH /users/:userId` で、パスパラメータの `userId` を `c.get('user').userId` と照合せずに Repository に渡している。

### 出力
```
## Resource Authorization Review 結果

### 違反あり
- **ファイル**: backend/src/api/front-user/controller/update-front-user.controller.ts:31
- **違反内容**: パスパラメータの `userId` を認証済みユーザーの `c.get('user').userId` と照合せずに Repository に渡している。他ユーザーのプロフィールを更新できる。
- **修正方針**: Repository 呼び出し前に `c.get('user').userId.value !== userId` の場合に 403 を返す照合チェックを追加する。
```

---

## ケース2: Repository の WHERE 句に userId フィルタがない（NG）

### 状況
`DELETE /todo` の Repository に WHERE 句の userId フィルタが存在しない。

### 出力
```
## Resource Authorization Review 結果

### 違反あり
- **ファイル**: backend/src/api/todo/repository/delete-todo.repository.ts:20
- **違反内容**: DELETE クエリの WHERE 句に userId フィルタが存在しない。全ユーザーのタスクを削除できる。
- **修正方針**: WHERE 句に `eq(taskTransaction.userId, userId.value)` を追加する。
```

---

## ケース4: リソース ID で取得しているが所有者確認がない（NG）

### 状況
`DELETE /todo/:taskId` で、Repository が `WHERE id = :taskId` のみで削除している。認証済みユーザーの userId でのフィルタがないため、他ユーザーのタスクを削除できる。

### 出力
```
## Resource Authorization Review 結果

### 違反あり
- **ファイル**: backend/src/api/todo/repository/delete-todo.repository.ts:20
- **違反内容**: DELETE クエリの WHERE 句に `userId` フィルタがない。`taskId` のみで削除しているため、他ユーザーのリソースを操作できる。
- **修正方針**: WHERE 句に `eq(table.userId, authenticatedUserId.value)` を追加して所有者を限定する。
```

---

## ケース3: 問題なし（OK）

### 状況
`GET /todo/:taskId` で `c.get('user').userId` を Repository に渡し、WHERE 句に `eq(table.userId, userId.value)` のフィルタが適用されている。

### 出力
```
## Resource Authorization Review 結果

チェック完了。問題なし。
```
