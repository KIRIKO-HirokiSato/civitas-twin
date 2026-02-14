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
- `.env.local` は `.gitignore` 対象だが `.dockerignore` からは除外（Cloud Build 時に読み取るため）。

## アーキテクチャ詳細

[docs/architecture.yaml](docs/architecture.yaml) を参照。
コンポーネント構成、データフロー、GCP IAM設定、ビルドパイプラインを網羅。
