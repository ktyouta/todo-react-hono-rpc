-- =============================================
-- マスターデータ
-- テーブルはマイグレーション済みであることが前提
-- 実行: npm run db:seed:master:local
-- =============================================

-- シーケンスマスタ（ID採番用）
INSERT OR IGNORE INTO seq_master (key, next_id, created_at, updated_at) VALUES
  ('front_user_id', 1, datetime('now'), datetime('now'));

-- カテゴリマスタ（種別）
INSERT OR IGNORE INTO category_master (id, name, sort_order, created_at, updated_at) VALUES
  (1, 'タスク', 1, datetime('now'), datetime('now')),
  (2, 'メモ',   2, datetime('now'), datetime('now'));

-- ステータスマスタ
INSERT OR IGNORE INTO status_master (id, name, sort_order, created_at, updated_at) VALUES
  (1, '未着手', 1, datetime('now'), datetime('now')),
  (2, '着手中', 2, datetime('now'), datetime('now')),
  (3, '完了',   3, datetime('now'), datetime('now'));
