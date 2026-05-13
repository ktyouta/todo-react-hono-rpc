# Expected Output — 水平展開対象ファイル一覧

## 入力例

「タスクに優先度フィールドを追加したい」

---

## 期待される出力

```
## 水平展開対象ファイル

### バックエンド
- `backend/src/domain/task/task.ts` — 優先度フィールドをドメイン型に追加
- `backend/src/infrastructure/db/schema.ts` — Drizzle スキーマにカラム追加
- `backend/src/application/task/task-service.ts` — create / update の引数に優先度を追加
- `backend/src/presentation/task/task-controller.ts` — リクエスト受け取り・レスポンスに優先度を含める
- `backend/src/presentation/task/task-validator.ts` — Zod バリデーションに優先度を追加
- `backend/drizzle/migrations/` — マイグレーションファイルを新規生成（`db:generate` で作成）
- `backend/src/application/task/task-service.test.ts` — テスト更新

### フロントエンド
- `frontend/src/features/task/components/TaskForm.tsx` — 優先度入力フィールド追加
- `frontend/src/features/task/components/TaskCard.tsx` — 優先度の表示追加
- `frontend/src/features/task/hooks/useCreateTask.ts` — 優先度をリクエストに含める
- `frontend/src/features/task/hooks/useUpdateTask.ts` — 優先度をリクエストに含める

---
合計: 11 ファイル（うち新規作成: 1）
```
