# Expected Output — 実装タスク分解

## 入力例

「タスクにコメント機能を追加したい。ユーザーがタスクに複数のコメントを投稿・削除できる」

---

## 期待される出力

```
## 実装タスク分解

### バックエンド

| # | タスク | ファイル | 前提 |
|---|--------|----------|------|
| 1 | comments テーブル定義追加 | `backend/src/infrastructure/db/schema.ts` | ― |
| 2 | マイグレーション生成 | `backend/drizzle/migrations/` | #1 |
| 3 | Comment ドメイン型定義 | `backend/src/domain/comment/comment.ts` | ― |
| 4 | CommentRepository 実装（create / delete / findByTaskId） | `backend/src/infrastructure/comment/comment-repository.ts` | #1 |
| 5 | CommentService 実装（create / delete） | `backend/src/application/comment/comment-service.ts` | #4 |
| 6 | コメントバリデーション（Zod） | `backend/src/presentation/comment/comment-validator.ts` | ― |
| 7 | CommentController 実装 | `backend/src/presentation/comment/comment-controller.ts` | #5, #6 |
| 8 | Router へのエンドポイント登録 | `backend/src/presentation/comment/comment-router.ts` | #7 |
| 9 | CommentService テスト | `backend/src/application/comment/comment-service.test.ts` | #5 |

### フロントエンド

| # | タスク | ファイル | 前提 |
|---|--------|----------|------|
| 10 | useComments hook（一覧取得） | `frontend/src/features/comment/hooks/useComments.ts` | バックエンド #8 |
| 11 | useCreateComment hook | `frontend/src/features/comment/hooks/useCreateComment.ts` | バックエンド #8 |
| 12 | useDeleteComment hook | `frontend/src/features/comment/hooks/useDeleteComment.ts` | バックエンド #8 |
| 13 | CommentList コンポーネント（Presentational） | `frontend/src/features/comment/components/CommentList.tsx` | ― |
| 14 | CommentForm コンポーネント（Presentational） | `frontend/src/features/comment/components/CommentForm.tsx` | ― |
| 15 | CommentSection コンテナ（hooks と接続） | `frontend/src/features/comment/components/CommentSection.tsx` | #10〜14 |
| 16 | TaskDetail ページへの CommentSection 組み込み | `frontend/src/features/task/pages/TaskDetailPage.tsx` | #15 |

---
合計: 16 タスク（バックエンド 9 / フロントエンド 7）
推奨着手順: #1 → #2 → #3, #4 → #5 → #6, #7 → #8 → #9 → #10〜12 → #13, #14 → #15 → #16
```
