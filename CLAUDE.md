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

Cloud Run へのデプロイ（Vertex AI は Application Default Credentials を使用）:

```bash
export CLOUDSDK_ACTIVE_CONFIG_NAME=kiriko-civitas && \
gcloud run deploy civitas-twin \
  --source . \
  --region=asia-northeast1 \
  --allow-unauthenticated \
  --port=8080 \
  --project=gen-lang-client-0491126700
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

**Service URL**: https://civitas-twin-902796884296.asia-northeast1.run.app

**認証方式**: Vertex AI は Cloud Run のサービスアカウント（Application Default Credentials）を使用。
APIキーは不要。

## 環境変数

### アーキテクチャ変更（Vertex AI 移行済み）

**v1.3以降**: Vertex AI を使用し、Application Default Credentials (ADC) で認証。
APIキーは不要。

| 環境 | 認証方法 |
|------|---------|
| **ローカル開発** | `gcloud auth application-default login` |
| **Cloud Run本番** | サービスアカウント（自動）|

### ローカル開発

```bash
# Application Default Credentials を設定
gcloud auth application-default login

# 開発サーバー起動（フロントエンド）
npm run dev

# または、本番と同じ構成でテスト
npm run build
npm start
```

### Cloud Run 本番環境

Cloud Run のデフォルトサービスアカウントが自動的に Vertex AI へのアクセス権限を持つ。
環境変数の設定は不要。

**重要**: `.env.local` は不要になったが、削除せずに `.gitignore` で管理することを推奨（将来の拡張用）。

## アーキテクチャ詳細

[docs/architecture.yaml](docs/architecture.yaml) を参照。
コンポーネント構成、データフロー、GCP IAM設定、ビルドパイプラインを網羅。

---

## Vertex AI - Gemini 3 系モデル情報

### 利用可能なモデル

| モデル名 | API 指定文字列 | ステータス | 用途 |
|---------|--------------|----------|------|
| Gemini 3 Pro | `gemini-3-pro-preview` | Public Preview | 高度な推論、複雑なエージェントワークフロー、コーディング |
| Gemini 3 Flash | `gemini-3-flash-preview` | Public Preview | 複雑なマルチモーダル理解、エージェントワークフロー、コスト最適化 |

### ⚠️ 重要: リージョン制限

**Gemini 3 系モデルはグローバルエンドポイントのみ対応**

- asia-northeast1（東京）では利用不可
- **location を `global` に設定する必要があります**

```javascript
const vertexAI = new VertexAI({
  project: 'gen-lang-client-0491126700',
  location: 'global',  // asia-northeast1 では動作しません
});
```

### モデル仕様

- **入力トークン上限**: 1,048,576 (1M)
- **出力トークン上限**: 65,536 (64K)
- **知識カットオフ**: 2025年1月
- **マルチモーダル対応**: テキスト、画像、音声、動画、PDF、コード

### 必要な IAM ロール

- `roles/aiplatform.user` (推奨)
- 主要権限: `aiplatform.endpoints.predict`

### 参考リンク

- [Gemini 3 Pro Documentation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-pro)
- [Gemini 3 Flash Documentation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-flash)
- [Vertex AI Locations](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/locations)

---

## トラブルシューティング

### 「推論エンジンが停止しました」エラーが表示される

**原因**: バックエンドが Vertex AI にアクセスできていない。

**診断方法（ローカル開発）**:
```bash
# Application Default Credentials が設定されているか確認
gcloud auth application-default print-access-token

# サーバーログを確認
npm start
# 期待: 🤖 Vertex AI: Project gen-lang-client-0491126700, Location asia-northeast1
```

**診断方法（Cloud Run本番）**:
```bash
# ログを確認
export CLOUDSDK_ACTIVE_CONFIG_NAME=kiriko-civitas && \
gcloud run services logs read civitas-twin \
  --region=asia-northeast1 \
  --project=gen-lang-client-0491126700 \
  --limit=50
```

**解決手順（ローカル）**:
1. Application Default Credentials を設定: `gcloud auth application-default login`
2. サーバーを再起動: `npm start`

**解決手順（Cloud Run）**:
1. サービスアカウントに Vertex AI 権限があるか確認
2. ログで詳細なエラーメッセージを確認

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

### 認証管理（✅ Vertex AI 移行済み）

**v1.3以降**: Vertex AI + Application Default Credentials (ADC) を使用し、
APIキーのクライアントサイド露出リスクを根本的に解消。

#### 実装済みのセキュリティ対策

1. **✅ バックエンドプロキシ**:
   - Express サーバーが `/api/generate`, `/api/chat/send` エンドポイントを提供
   - Vertex AI 呼び出しはサーバーサイドのみで実行
   - フロントエンドからは直接 Vertex AI にアクセスしない

2. **✅ サービスアカウント認証**:
   - Cloud Run はデフォルトサービスアカウントで Vertex AI にアクセス
   - APIキー不要（ADCを使用）
   - クライアントサイドのJSバンドルには一切の認証情報が含まれない

3. **✅ CORS設定**:
   - 本番URL (https://civitas-twin-902796884296.asia-northeast1.run.app) のみ許可
   - 開発時は localhost:3000/8080 も許可

4. **✅ レート制限**:
   - `/api/*` エンドポイントに15分あたり50リクエストの制限
   - DDoS攻撃・API枯渇攻撃対策

5. **✅ エラーハンドリング**:
   - 本番環境では error.message を返さず、汎用エラーメッセージのみ返却
   - 内部構成の漏洩を防止

#### 今後の改善検討項目（本番運用前）

- **認証・認可の実装**: Firebase Authentication 等でユーザー認証
- **より細かいレート制限**: ユーザー単位、セッション単位の制限

#### セキュリティ検証コマンド

```bash
# ビルド成果物に認証情報が含まれていないことを確認
npm run build
grep -q "AIzaSy" dist/assets/*.js && echo "⚠️ APIキー検出" || echo "✅ セキュア"
```
