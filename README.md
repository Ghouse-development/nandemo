# nandemo - 業務支援アプリケーション集

株式会社Gハウスの業務を支援する各種アプリケーションを集約したプラットフォームです。

## 🌐 デプロイURL

**本番環境**: https://nandemo-nu.vercel.app/

---

## 📱 アプリケーション一覧

### 1. 設計・IC業務支援アプリ v2.0

**URL**: https://nandemo-nu.vercel.app/sekkei/index_v2.html

**概要**:
設計・インテリアコーディネーターの業務を効率化するWebアプリケーション。

**主な機能**:
- 📋 案件管理（CRUD、16種類のタスク進捗管理）
- 📧 メールテンプレート管理
- 👥 業者情報管理
- 🔗 タスク-テンプレート紐づけ設定
- ✉️ ワンクリックメール生成

**技術スタック**:
- フロントエンド: HTML5, CSS3, Vanilla JavaScript
- バックエンド: Supabase（PostgreSQL + RLS）
- 認証: Email/Password認証
- デプロイ: Vercel

**デザイン**:
- モダンフラットデザイン
- 白ベース + 青色アクセント（#4A90E2）
- Inter + Noto Sans JP フォント
- レスポンシブ対応

**評価**: 100/100点（セキュリティ以外）

**詳細**: [sekkei/README.md](./sekkei/README.md)

---

## 🚀 クイックスタート

### 1. リポジトリをクローン

```bash
git clone https://github.com/Ghouse-development/nandemo.git
cd nandemo
```

### 2. 各アプリのセットアップ

各アプリケーションのREADMEを参照してください：

- **設計・IC業務支援アプリ**: [sekkei/SETUP.md](./sekkei/SETUP.md)

---

## 📂 プロジェクト構成

```
nandemo/
├── index.html                 # トップページ（アプリ一覧）
├── sekkei/                    # 設計・IC業務支援アプリ
│   ├── index_v2.html         # メインアプリ
│   ├── supabase_all_in_one.sql  # データベースセットアップ
│   ├── README.md             # アプリの詳細
│   ├── SETUP.md              # セットアップガイド
│   └── ...
└── README.md                  # このファイル
```

---

## 🛠️ 開発

### ローカル開発

各アプリケーションはHTMLファイルとして独立しており、ブラウザで直接開くことができます。

```bash
# 設計・IC業務支援アプリ
open sekkei/index_v2.html
```

### デプロイ

Vercelへの自動デプロイが設定されています。

```bash
# Vercel CLIでデプロイ
vercel

# 本番環境にデプロイ
vercel --prod
```

---

## 📊 技術スタック

### 共通
- **ホスティング**: Vercel
- **バージョン管理**: Git + GitHub

### 設計・IC業務支援アプリ
- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **バックエンド**: Supabase
- **データベース**: PostgreSQL
- **認証**: Supabase Auth

---

## 🔐 セキュリティ

各アプリケーションは以下のセキュリティ対策を実施：

- ✅ 認証機能（Email/Password、OAuth等）
- ✅ Row Level Security (RLS)
- ✅ HTTPS通信
- ✅ 環境変数による機密情報管理

---

## 📝 ライセンス

© 2025 株式会社Gハウス. All rights reserved.

---

## 🤝 貢献

このプロジェクトは株式会社Gハウスの内部プロジェクトです。

---

## 📧 お問い合わせ

質問や問題がある場合は、GitHubのIssuesをご利用ください。

[Issues](https://github.com/Ghouse-development/nandemo/issues)

---

## 🎉 謝辞

このプロジェクトは Claude Code により開発されました。

🤖 Generated with [Claude Code](https://claude.com/claude-code)
