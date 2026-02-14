# Civitas Twin — Claude Code 運用ガイド

## GCP 操作の前提

このプロジェクトは direnv + gcloud Named Configuration で GCP アカウントを管理している。

- **Config名**: `kiriko-civitas`
- **Account**: `h.sato@kiriko.tech`
- **Project**: `gen-lang-client-0491126700`
- **Region**: `asia-northeast1`

### direnv が効かない場合

Claude Code のシェルでは direnv が自動ロードされないことがある。
すべての gcloud コマンドの先頭に以下を付与すること:

```bash
export CLOUDSDK_ACTIVE_CONFIG_NAME=kiriko-civitas && gcloud ...
```

## デプロイ

Cloud Run へのデプロイ:

```bash
export CLOUDSDK_ACTIVE_CONFIG_NAME=kiriko-civitas && \
gcloud run deploy civitas-twin \
  --source . \
  --region=asia-northeast1 \
  --allow-unauthenticated \
  --port=8080 \
  --project=gen-lang-client-0491126700
```

組織ポリシーにより `allUsers` の IAM バインディングが拒否されるため、
デプロイ後に IAM チェックを無効化する:

```bash
export CLOUDSDK_ACTIVE_CONFIG_NAME=kiriko-civitas && \
gcloud run services update civitas-twin \
  --region=asia-northeast1 \
  --project=gen-lang-client-0491126700 \
  --no-invoker-iam-check
```

**Service URL**: https://civitas-twin-902796884296.asia-northeast1.run.app

## 環境変数

- `GEMINI_API_KEY`: `.env.local` に定義。Vite がビルド時に `process.env.API_KEY` / `process.env.GEMINI_API_KEY` として埋め込む。
- `.env.local` は `.gitignore` 対象だが **`.gcloudignore` からは除外**（Cloud Build 時に読み取るため）。

### 重要: `.gcloudignore` の役割

`.gcloudignore` が存在しない場合、`gcloud run deploy --source .` は `.gitignore` をフォールバックとして使用する。
`.gitignore` に `*.local` が含まれているため、`.gcloudignore` がないと **`.env.local` が Cloud Build のコンテキストから除外される**。

結果として：
1. Cloud Build 時に `GEMINI_API_KEY` が undefined になる
2. Vite ビルドで `process.env.API_KEY` が `void 0` に置換される
3. ランタイムで "API key must be set" エラーが発生
4. UI に「推論エンジンが停止しました」と表示される

**`.gcloudignore` は必須ファイル** — 削除しないこと。

## アーキテクチャ詳細

[docs/architecture.yaml](docs/architecture.yaml) を参照。
コンポーネント構成、データフロー、GCP IAM設定、ビルドパイプラインを網羅。

---

## トラブルシューティング

### 「推論エンジンが停止しました」エラーが表示される

**原因**: Gemini API キーが正しく埋め込まれていない。

**診断方法**:
```bash
# ビルド成果物にAPIキーが埋め込まれているか確認
grep -o "AIzaSy[A-Za-z0-9_-]*" dist/assets/index-*.js

# 期待: AIzaSyCr4ct... のような実際のキー
# NG: 出力なし、または "PLACEHOLDER_API_KEY"、"void 0"
```

**解決手順**:
1. `.env.local` に正しい `GEMINI_API_KEY` が設定されているか確認
2. `.gcloudignore` が存在するか確認（存在しない場合は作成）
3. ローカル再ビルド: `npm run build`
4. ビルド成果物を確認（上記 grep コマンド）
5. Cloud Run に再デプロイ（デプロイコマンドは上記参照）

### gcloud 認証エラー

```
ERROR: Reauthentication failed. cannot prompt during non-interactive execution.
```

**解決方法**:
```bash
gcloud auth login
```

---

## セキュリティに関する注意

### APIキーのクライアントサイド露出リスク

現在の設計では、**Gemini API キーがクライアントサイドの JS バンドルにハードコードされる**。

**リスク**:
- ブラウザの DevTools でバンドルファイルを閲覧し、APIキーを抽出可能
- 第三者による不正利用（課金リスク）
- API キーのローテーションが困難

**現状の位置づけ**:
- ハッカソン短期用途では許容（`architecture.yaml` に明記）
- 本番運用や長期運用には **不適切**

**推奨される改善策**（本番運用前に実施）:
1. **バックエンドプロキシの追加**:
   - Cloud Functions または Cloud Run バックエンドサービスを作成
   - バックエンド側で Gemini API を呼び出し
   - フロントエンドはバックエンド経由でリクエスト
2. **環境変数の管理**:
   - Cloud Run の環境変数または Secret Manager を使用
   - APIキーをサーバーサイドのみに保持
3. **認証・認可の実装**:
   - Firebase Authentication 等でユーザー認証
   - バックエンドで認証トークンを検証してからAPI呼び出し
