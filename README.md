# Civitas Twin M1.2 Professional

> 高度社会反応推定エンジン — 100万人規模のペルソナによる精密な社会シミュレーション

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Click_Here-4285F4?style=for-the-badge)](https://civitas-twin-902796884296.asia-northeast1.run.app)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-Run-4285F4?logo=googlecloud&style=flat-square)](https://cloud.google.com/run)
[![Gemini API](https://img.shields.io/badge/Gemini-API-8E75B2?logo=google&style=flat-square)](https://ai.google.dev/)

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
| **AI/ML** | Google Gemini API (gemini-3-pro-preview) |
| **デプロイ** | Google Cloud Run (Container) |
| **認証・管理** | GCP Named Configuration (direnv) |
| **CI/CD** | Cloud Build + gcloud CLI |

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

# 3. 環境変数を設定
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 4. 開発サーバーを起動
npm run dev
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
- Gemini API キー取得済み

### デプロイ手順

```bash
# Named Configuration を設定（初回のみ）
gcloud config configurations create civitas-twin
gcloud config set account your-email@example.com
gcloud config set project YOUR_PROJECT_ID
gcloud config set run/region asia-northeast1

# デプロイ
export CLOUDSDK_ACTIVE_CONFIG_NAME=civitas-twin
gcloud run deploy civitas-twin \
  --source . \
  --region=asia-northeast1 \
  --allow-unauthenticated \
  --port=8080

# IAMチェック無効化（組織ポリシー対応）
gcloud run services update civitas-twin \
  --region=asia-northeast1 \
  --no-invoker-iam-check
```

**重要**: `.gcloudignore` は削除しないでください（`.env.local` を Cloud Build に含めるため）

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

**Q: 「推論エンジンが停止しました」エラーが出る**

A: Gemini API キーが正しく埋め込まれていない可能性があります。

```bash
# ビルド成果物を確認
grep -o "AIzaSy[A-Za-z0-9_-]*" dist/assets/index-*.js

# .env.local の設定を確認
cat .env.local
```

---

## 🔒 セキュリティ

**v1.2以降**: ✅ **バックエンドプロキシ実装済み** — APIキーのクライアント露出を解消

### 実装済みのセキュリティ対策

- ✅ Express サーバーによるバックエンドプロキシ
- ✅ Gemini API 呼び出しはサーバーサイドのみ
- ✅ APIキーは環境変数で管理（クライアントバンドルに含まれない）
- ✅ CORS 設定による適切なアクセス制御

### 検証方法

```bash
# ビルド成果物にAPIキーが含まれていないことを確認
npm run build
grep -q "AIzaSy" dist/assets/*.js && echo "⚠️ APIキー検出" || echo "✅ セキュア"
```

詳細: [CLAUDE.md - セキュリティ](CLAUDE.md#セキュリティ)

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
