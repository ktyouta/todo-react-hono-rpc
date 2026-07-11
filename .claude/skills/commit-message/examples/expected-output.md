# Expected Output — Commit Message

---

## ケース1: 英語コミット履歴のプロジェクト

### 状況
- タスク一覧のサブタスク作成ボタンコンポーネントを新規追加した

### 出力

```
## コミットメッセージ候補

### 詳細版
1. Add subtask create button with dialog to todo detail page（タスク詳細画面にダイアログ付きのサブタスク作成ボタンを追加）
   → 変更の主体（subtask create button）・UI要素・配置場所を具体的に伝えている
2. Implement subtask create component with Container/Presentational pattern（Container/Presentationalパターンでサブタスク作成コンポーネントを実装）
   → 設計パターンを明示することでレビュアーへの伝達力が高い
3. Add subtask-create feature with container and dialog components（subtask-createとcontainer・dialogコンポーネントで機能を追加）
   → ファイル構成の変化を伝えている
4. Create subtask creation feature on todo detail screen using presentational components（Presentationalコンポーネントを使ってタスク詳細画面にサブタスク作成機能を作成）
   → 「feature」という語で機能単位の追加であることを示している
5. Build subtask create dialog for todo detail page（タスク詳細画面用のサブタスク作成ダイアログを構築）
   → UI要素（dialog）を具体的に伝えている

### 簡易版
1. Add subtask create button to todo detail page（タスク詳細画面にサブタスク作成ボタンを追加）
   → 変更内容を最短で伝える定番スタイル
2. Implement subtask create UI（サブタスク作成UIを実装）
   → UIの追加であることを明確にしている
3. Add subtask-create components（サブタスク作成コンポーネントを追加）
   → コンポーネント単位の追加であることを示している
4. Create subtask creation feature（サブタスク作成機能を作成）
   → 機能追加であることを1語で表現している
5. Add subtask create dialog（サブタスク作成ダイアログを追加）
   → 最も簡潔なスタイル
```

---

## ケース2: 日本語コミット履歴のプロジェクト

### 状況
- バックエンドのタスク削除 API でバグを修正した

### 出力

```
## コミットメッセージ候補

### 詳細版
1. タスク削除時に紐づくサブタスクが削除されない問題を修正
   → バグの症状と再現条件を具体的に伝えている
2. delete-todo: サブタスクの一括削除処理を db.batch に追加
   → ファイル名プレフィックスで影響範囲を限定している
3. タスク削除 API でサブタスクが孤立レコードとして残るバグを修正
   → 根本原因（サブタスクの孤立）まで言及している
4. バグ修正: タスク削除時にサブタスクが削除されない問題
   → 「バグ修正」プレフィックスで種別を明示している
5. delete-todo サービス: カスケード削除漏れを修正
   → 修正箇所（サービス層）と問題の種類（カスケード削除漏れ）を明示している

### 簡易版
1. タスク削除バグを修正
   → 変更内容を最短で伝える
2. バグ修正: タスク削除 API のサブタスク削除漏れ
   → 種別と対象を明確にしている
3. delete-todo の削除処理を修正
   → 影響ファイルが特定できる
4. サブタスクが削除されない問題を修正
   → 現象ベースで伝えている
5. タスク削除 API バグ修正
   → 最もシンプルなスタイル
```
