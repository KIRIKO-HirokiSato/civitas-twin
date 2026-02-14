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

Cloud Run へのデプロイ（**重要**: 環境変数 `GEMINI_API_KEY` の設定が必須）:

```bash
export CLOUDSDK_ACTIVE_CONFIG_NAME=kiriko-civitas && \
gcloud run deploy civitas-twin \
  --source . \
  --region=asia-northeast1 \
  --allow-unauthenticated \
  --port=8080 \
  --project=gen-lang-client-0491126700 \
  --set-env-vars="GEMINI_API_KEY=YOUR_API_KEY_HERE"
```

**初回デプロイ後**、組織ポリシーにより `allUsers` の IAM バインディングが拒否されるため、
IAM チェックを無効化する:

```bash
export CLOUDSDK_ACTIVE_CONFIG_NAME=kiriko-civitas && \
gcloud run services update civitas-twin \
  --region=asia-northeast1 \
  --project=gen-lang-client-0491126700 \
  --no-invoker-iam-check
```

**環境変数の更新のみ**（コード変更なし）:

```bash
export CLOUDSDK_ACTIVE_CONFIG_NAME=kiriko-civitas && \
gcloud run services update civitas-twin \
  --region=asia-northeast1 \
  --project=gen-lang-client-0491126700 \
  --set-env-vars="GEMINI_API_KEY=YOUR_NEW_API_KEY"
```

**Service URL**: https://civitas-twin-902796884296.asia-northeast1.run.app

## 環境変数

### アーキテクチャ変更（セキュリティ改善済み）

**v1.2以降**: APIキーはバックエンド（Express）で管理され、クライアントサイドには露出しない。

| 環境 | 設定方法 |
|------|---------|
| **ローカル開発** | `.env.local` ファイル（`GEMINI_API_KEY=xxx`） |
| **Cloud Run本番** | `--set-env-vars` フラグで環境変数を設定 |

### ローカル開発

```bash
# .env.local を作成
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 開発サーバー起動（フロントエンド）
npm run dev

# または、本番と同じ構成でテスト
npm run build
npm start
```

### Cloud Run 本番環境

環境変数は **デプロイ時に `--set-env-vars` で設定**。`.env.local` は Cloud Build にアップロードされない。

```bash
# 環境変数を指定してデプロイ
gcloud run deploy civitas-twin \
  --source . \
  --set-env-vars="GEMINI_API_KEY=your_api_key_here"
```

**重要**: 過去のバージョンとは異なり、`.gcloudignore` から `.env.local` を除外する必要はなくなった（バックエンドが環境変数を使用するため）。

## アーキテクチャ詳細

[docs/architecture.yaml](docs/architecture.yaml) を参照。
コンポーネント構成、データフロー、GCP IAM設定、ビルドパイプラインを網羅。

---

## トラブルシューティング

### 「推論エンジンが停止しました」エラーが表示される

**原因**: バックエンドが Gemini API キーを取得できていない。

**診断方法（ローカル開発）**:
```bash
# .env.local が存在するか確認
cat .env.local

# サーバーログを確認
npm start
# 期待: 🔑 Gemini API Key: ✓ Loaded
# NG:   🔑 Gemini API Key: ✗ Missing
```

**診断方法（Cloud Run本番）**:
```bash
# 環境変数が設定されているか確認
gcloud run services describe civitas-twin \
  --region=asia-northeast1 \
  --project=gen-lang-client-0491126700 \
  --format="value(spec.template.spec.containers[0].env)"

# ログを確認
gcloud run services logs read civitas-twin \
  --region=asia-northeast1 \
  --project=gen-lang-client-0491126700 \
  --limit=50
```

**解決手順（ローカル）**:
1. `.env.local` に正しい `GEMINI_API_KEY` が設定されているか確認
2. サーバーを再起動: `npm start`

**解決手順（Cloud Run）**:
1. 環境変数を設定してデプロイ（デプロイコマンドは上記参照）
2. デプロイ完了後、ログを確認

### gcloud 認証エラー

```
ERROR: Reauthentication failed. cannot prompt during non-interactive execution.
```

**解決方法**:
```bash
gcloud auth login
```

---

## セキュリティ

### APIキー管理（✅ 改善済み）

**v1.2以降**: バックエンドプロキシを実装し、APIキーのクライアントサイド露出を解消。

#### 実装済みのセキュリティ対策

1. **✅ バックエンドプロキシ**:
   - Express サーバーが `/api/generate`, `/api/chat/send` エンドポイントを提供
   - Gemini API 呼び出しはサーバーサイドのみで実行
   - フロントエンドからは直接 Gemini API にアクセスしない

2. **✅ 環境変数管理**:
   - APIキーは Cloud Run の環境変数として管理
   - クライアントサイドのJSバンドルには含まれない
   - ビルド成果物確認: `grep "AIzaSy" dist/assets/*.js` → 出力なし

3. **✅ CORS設定**:
   - Express で CORS を有効化（必要に応じて制限可能）

#### 今後の改善検討項目（本番運用前）

- **認証・認可の実装**: Firebase Authentication 等でユーザー認証
- **レート制限**: API呼び出し頻度の制限（DDoS対策）
- **Secret Manager統合**: より高度なシークレット管理（現状は環境変数で十分）

#### セキュリティ検証コマンド

```bash
# ビルド成果物にAPIキーが含まれていないことを確認
npm run build
grep -q "AIzaSy" dist/assets/*.js && echo "⚠️ APIキー検出" || echo "✅ セキュア"
```
