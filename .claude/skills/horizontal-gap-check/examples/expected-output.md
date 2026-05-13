# Expected Output — 水平展開漏れチェック結果

## 入力例

「タスクに優先度フィールドを追加した。変更したのは以下：
- `backend/src/domain/task/task.ts`
- `backend/src/infrastructure/db/schema.ts`
- `backend/src/application/task/task-service.ts`
- `frontend/src/features/task/components/TaskForm.tsx`
」

---

## 期待される出力（漏れあり）

```
## 水平展開漏れチェック結果

### 漏れあり

#### バックエンド
- `backend/src/presentation/task/task-controller.ts` — 優先度をリクエスト受け取り・レスポンスに含める必要がある
- `backend/src/presentation/task/task-validator.ts` — Zod バリデーションに優先度フィールドの追加が必要
- `backend/drizzle/migrations/` — マイグレーションファイルの生成が必要（`db:generate` 未実行）
- `backend/src/application/task/task-service.test.ts` — テストの更新が必要

#### フロントエンド
- `frontend/src/features/task/components/TaskCard.tsx` — 優先度の表示が未対応
- `frontend/src/features/task/hooks/useCreateTask.ts` — 優先度をリクエストに含める必要がある
- `frontend/src/features/task/hooks/useUpdateTask.ts` — 優先度をリクエストに含める必要がある

---
漏れ: 7 ファイル
```

---

## 期待される出力（漏れなし）

```
## 水平展開漏れチェック結果

漏れなし。水平展開は完了しています。
```
