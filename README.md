# Civitas Twin M1.2 Professional

> 高度社会反応推定エンジン — 100万人規模のペルソナによる精密な社会シミュレーション

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Click_Here-4285F4?style=for-the-badge)](https://civitas-twin-902796884296.asia-northeast1.run.app)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-Run-4285F4?logo=googlecloud&style=flat-square)](https://cloud.google.com/run)
[![Vertex AI](https://img.shields.io/badge/Vertex_AI-Gemini_3-8E75B2?logo=google&style=flat-square)](https://cloud.google.com/vertex-ai)
[![Version](https://img.shields.io/badge/version-1.3.1-blue?style=flat-square)](docs/architecture.yaml)

---

## 📌 概要

**Civitas Twin** は、ニュースや政策に対する社会の反応を科学的に推定するAIエージェントシステムです。

単なる言語モデルではなく、**5,000体の心理学的ペルソナ**を100万人規模に投影し、5つの主要社会心理学理論（Schwartz価値理論、Prospect理論、ELM、Zaller、TPB）を統合した「理論駆動型シミュレーション」により、根拠のある社会反応予測を実現します。

### 🎯 ユースケース

- **政策立案**: 新制度・規制の国民反応を事前予測
- **マーケティング**: 商品・キャンペーンの受容性分析
- **リスク管理**: 炎上リスク・風評被害の事前検知
- **報道分析**: ニュースが世論に与える影響の定量評価

---

## 🏗️ アーキテクチャ

### コア技術スタック

| レイヤー | 技術 |
|---------|------|
| **フロントエンド** | React 19 + TypeScript + Vite |
| **バックエンド** | Express 5.2 + Node.js 22 |
| **AI/ML** | Vertex AI + Gemini 3 Pro Preview |
| **認証** | Application Default Credentials (ADC) |
| **デプロイ** | Google Cloud Run (Container) |
| **環境管理** | direnv + gcloud Named Configuration |
| **CI/CD** | Cloud Build + Artifact Registry |

### 3段階の推論プロセス

```
Phase 01: Hyper-Resolution Persona
  ↓ N=5,000 (21+パラメータ: リスク感受性、意思決定速度など)

Phase 02: Mega-Scale DNA Projection
  ↓ N=1,000,000 (5つの社会心理学理論で拡張)

Phase 03: Inference Control
  → 外部環境分析 (Google Search) + 理論的整合性保証
```

詳細なアーキテクチャ図: [docs/architecture.yaml](docs/architecture.yaml)

---

## 🚀 クイックスタート

### ローカル開発

```bash
# 1. リポジトリをクローン
git clone https://github.com/KIRIKO-HirokiSato/civitas-twin.git
cd civitas-twin

# 2. 依存関係をインストール
npm install

# 3. GCP認証を設定（Application Default Credentials）
gcloud auth application-default login

# 4. 開発サーバーを起動（バックエンド + フロントエンド）
npm start  # ポート8080でExpressサーバーが起動
```

### 本番ビルド

```bash
npm run build
npm run preview
```

---

## ☁️ Cloud Run デプロイ

### 前提条件

- gcloud CLI インストール済み
- GCP プロジェクト作成済み
- Vertex AI API 有効化済み
- Cloud Run サービスアカウントに `roles/aiplatform.user` 権限付与済み

### デプロイ手順

```bash
# Named Configuration を設定（初回のみ）
gcloud config configurations create civitas-twin
gcloud config set account your-email@example.com
gcloud config set project YOUR_PROJECT_ID
gcloud config set run/region asia-northeast1

# Vertex AI API を有効化
gcloud services enable aiplatform.googleapis.com

# Cloud Run サービスアカウントに権限付与
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# デプロイ（Application Default Credentials で認証）
export CLOUDSDK_ACTIVE_CONFIG_NAME=civitas-twin
gcloud run deploy civitas-twin \
  --source . \
  --region=asia-northeast1 \
  --allow-unauthenticated \
  --port=8080 \
  --project=YOUR_PROJECT_ID

# IAMチェック無効化（組織ポリシー対応）
gcloud run services update civitas-twin \
  --region=asia-northeast1 \
  --project=YOUR_PROJECT_ID \
  --no-invoker-iam-check
```

**重要**:
- Vertex AI はサービスアカウントの Application Default Credentials (ADC) で認証されます
- APIキーの設定は不要です

---

## 📊 機能

### ✨ シミュレーション実行

- ニュース記事を入力
- 目的（政策評価、炎上予測など）を指定
- 地域（日本全国、東京都など）を選択
- 100万人規模の反応分布を推定

### 💬 インタラクティブ対話

- 専門エージェントとの深掘り対話
- 追加の分析リクエスト
- 統計的根拠の確認

### 📜 履歴管理

- 過去のシミュレーション結果を保存
- レポートの再表示
- スナップショットID管理

---

## 🎓 使用している理論

| 理論 | 適用箇所 |
|------|---------|
| **Schwartz価値理論** | 価値観ベースの反応予測 |
| **Prospect Theory** | リスク感受性のモデリング |
| **ELM (精緻化見込みモデル)** | 情報処理ルートの判定 |
| **Zaller受容モデル** | 世論形成プロセス |
| **TPB (計画的行動理論)** | 行動意図の推定 |

---

## 🏆 Agentic AI Hackathon with Google Cloud vol.4

本プロジェクトは **第4回 Agentic AI Hackathon with Google Cloud** への提出作品です。

- **テーマ**: 進化するAIと共に。君だけの『エージェント』を創り出そう
- **期間**: 2025年12月10日 〜 2026年2月15日
- **主催**: Zenn (クラスメソッド株式会社)
- **協賛**: グーグル・クラウド・ジャパン合同会社

### 技術要件（本プロジェクトでの達成）

- ✅ **Google Cloud実行プロダクト**: Cloud Run
- ✅ **Google Cloud AI技術**: Gemini API

---

## 📝 運用ガイド

詳細な運用手順・トラブルシューティングは [CLAUDE.md](CLAUDE.md) を参照してください。

### よくある問題

**Q: 「Permission denied」エラーが出る**

A: Cloud Run サービスアカウントに Vertex AI の権限が付与されていない可能性があります。

```bash
# サービスアカウントの権限を確認
gcloud projects get-iam-policy YOUR_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:PROJECT_NUMBER-compute@developer.gserviceaccount.com"

# roles/aiplatform.user が含まれていない場合は付与
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

**Q: ローカル開発で 403 エラーが出る**

A: Application Default Credentials が設定されていない可能性があります。

```bash
# ADC を設定
gcloud auth application-default login

# 認証情報を確認
gcloud auth application-default print-access-token
```

---

## 🔒 セキュリティ

**v1.3.0以降**: ✅ **Vertex AI + ADC 認証** — APIキー不要、完全なサーバーサイド認証

### 実装済みのセキュリティ対策

- ✅ **Application Default Credentials (ADC)** による認証
- ✅ Vertex AI API 呼び出しはサーバーサイドのみ
- ✅ APIキー管理が不要（クレデンシャル漏洩リスクゼロ）
- ✅ Express バックエンドプロキシによる API 抽象化
- ✅ CORS 設定による本番URL制限
- ✅ Rate Limiting (15分/50リクエスト)
- ✅ 本番環境でのエラー詳細非表示

### アーキテクチャの進化

| バージョン | 認証方式 | セキュリティリスク |
|-----------|---------|------------------|
| v1.0-1.1 | クライアントサイドAPIキー | ❌ 高リスク（バンドル露出） |
| v1.2 | バックエンド環境変数 | ⚠️ 中リスク（環境変数管理） |
| **v1.3** | **Vertex AI + ADC** | ✅ **低リスク（GCP IAM管理）** |

詳細: [CLAUDE.md - セキュリティ](CLAUDE.md#セキュリティに関する注意)

---

## 📄 ライセンス

MIT License

---

## 🙋 開発者

**KIRIKO-HirokiSato**

- GitHub: [@KIRIKO-HirokiSato](https://github.com/KIRIKO-HirokiSato)

---

## 🔗 リンク

- [Live Demo](https://civitas-twin-902796884296.asia-northeast1.run.app)
- [Architecture Docs](docs/architecture.yaml)
- [Hackathon Page](https://zenn.dev/hackathons/google-cloud-japan-ai-hackathon-vol4)
