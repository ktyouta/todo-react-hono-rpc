# PWA対応（案A: 最小PWA）実装計画

## 概要

Todoアプリをホーム画面・タスクバーにインストール可能にする。
`vite-plugin-pwa`（`generateSW` モード）で Web App Manifest と Service Worker を自動生成し、
静的アセット（JS/CSS/アイコン）のみプリキャッシュする。

**対象外**: API通信のキャッシュ、オフラインでのタスク作成・編集（バックエンド変更なし）

---

## タスク一覧

### フロントエンド（バックエンド変更なし）

- [x] #1 `vite-plugin-pwa` を devDependencies に追加（`frontend/package.json`）
- [x] #2 PWA アイコン画像を用意（192×192 / 512×512、maskable 含む）（`frontend/public/pwa-192x192.png`, `frontend/public/pwa-512x512.png`）
  - 既存デザインアイコンがないため、`vite.svg` を元にした簡易PNGアイコンで代用する
- [x] #3 `VitePWA` プラグイン設定（generateSW モード・manifest 定義）（`frontend/vite.config.ts`）
- [x] #4 Service Worker 自動更新の登録（`virtual:pwa-register`）（`frontend/src/main.tsx`）
- [x] #5 生成物（`dev-dist/` 等）を `.gitignore` に追加（`.gitignore`）
- [x] #6 ビルドして Manifest・Service Worker が生成されることを確認（`frontend/dist/`、確認のみ・成果物はコミット対象外）

推奨着手順: #1 → #2 → #3 → #4 → #5 → #6

---

## 設計判断メモ

- `injectManifest` ではなく `generateSW` を採用（カスタムSWロジック不要のため、Workbox標準生成で十分）
- API通信（`/api/**`）は `navigateFallbackDenylist` 等で除外し、誤ってキャッシュしないようにする
- 認証まわり（リフレッシュトークン用 `api-client.ts` の呼び出し先）もキャッシュ対象に含めない
