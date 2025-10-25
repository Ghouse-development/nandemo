# GハウスVC加盟店一覧機能

## 実装日
2025年10月26日

## 機能概要
全国のGハウスVC加盟店を地図上で可視化し、管理する機能

## 主要機能

### 1. 地図表示
- Leaflet（React Leaflet）を使用した日本地図の表示
- OpenStreetMapタイルレイヤーを使用
- 日本全体を俯瞰できるビュー（初期ズームレベル: 5）

### 2. 加盟店のピン表示
- 都道府県・市区町村単位での位置情報
- マーカーをクリックするとポップアップ表示
- ポップアップに表示される情報：
  - 工務店名
  - 完全な住所
  - 加盟年月日

### 3. 加盟店追加機能
- フォームによる加盟店情報の入力
- 必須項目：
  - 工務店名
  - 都道府県
  - 市区町村
  - 加盟年月日
- 任意項目：
  - 住所（市区町村以降）
- 自動ジオコーディング（住所→緯度経度変換）

### 4. 加盟店一覧テーブル
- 全加盟店のリスト表示
- 表示項目：工務店名、都道府県、市区町村、加盟年月日
- ホバー効果による視認性向上

### 5. ライブラリページへの統合
- 「GハウスVC加盟店一覧」カードを追加
- 地図アイコン（MapPin）とグラデーション背景で視覚的に目立つデザイン
- クリックで地図ページへ遷移

## 技術仕様

### フロントエンド
- **React**: UI構築
- **TypeScript**: 型安全性
- **Leaflet**: 地図ライブラリ
- **React Leaflet**: React用Leafletラッパー
- **Tailwind CSS**: スタイリング
- **Lucide React**: アイコン

### バックエンド
- **Supabase**: データベース・認証
- **PostgreSQL**: リレーショナルデータベース
- **Row Level Security (RLS)**: セキュリティ

### データベース設計

#### storesテーブル
```sql
- id: UUID (主キー、自動生成)
- name: TEXT (工務店名)
- prefecture: TEXT (都道府県)
- city: TEXT (市区町村)
- address: TEXT (住所詳細)
- full_address: TEXT (完全な住所)
- latitude: DECIMAL(10, 8) (緯度)
- longitude: DECIMAL(11, 8) (経度)
- joined_date: DATE (加盟年月日)
- created_at: TIMESTAMP (作成日時)
- updated_at: TIMESTAMP (更新日時)
```

#### インデックス
- prefecture（都道府県検索用）
- city（市区町村検索用）
- latitude, longitude（位置情報検索用）

#### セキュリティポリシー
- 認証済みユーザーは全てのCRUD操作が可能
- RLSによるアクセス制御

## ファイル構成

```
meetingbrain-mvp/
├── src/
│   ├── pages/
│   │   ├── StoreMap.tsx           # 加盟店地図ページ
│   │   └── Library.tsx            # 更新: カード追加
│   ├── lib/
│   │   └── types.ts               # 更新: Store型追加
│   ├── App.tsx                    # 更新: ルーティング追加
│   └── main.tsx                   # 更新: Leaflet CSS追加
├── supabase/
│   └── migrations/
│       └── create_stores_table.sql # テーブル作成SQL
└── .env                           # 環境変数（Supabase設定）
```

## ジオコーディング

### 現在の実装（簡易版）
- 都道府県の中心座標を使用
- 市区町村によって微調整（ランダムオフセット）

### 今後の改善案
- Google Maps Geocoding API
- 国土地理院の位置参照情報
- より精密な住所→座標変換

## 使用方法

### 加盟店の追加手順
1. 「加盟店追加」ボタンをクリック
2. フォームに情報を入力
   - 工務店名
   - 都道府県（例: 東京都）
   - 市区町村（例: 渋谷区）
   - 住所詳細（例: 道玄坂1-2-3）
   - 加盟年月日
3. 「追加」ボタンをクリック
4. 地図上に自動的にピンが表示される

### 加盟店情報の確認
- 地図上のマーカーをクリック
- ポップアップで詳細情報を確認
- 下部のテーブルで一覧確認

## セットアップ手順

### 1. Supabaseテーブル作成
```bash
# Supabase SQLエディタで以下のファイルを実行
supabase/migrations/create_stores_table.sql
```

### 2. 環境変数設定
```bash
# .envファイルに以下を設定
VITE_SUPABASE_URL=https://twzsirpfudqwboeyakta.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. 依存関係のインストール
```bash
cd meetingbrain-mvp
npm install
```

### 4. 開発サーバー起動
```bash
npm run dev
```

## アクセスURL
- ローカル開発: http://localhost:3456/stores
- Libraryページ: http://localhost:3456/library

## 今後の拡張案

1. **検索・フィルター機能**
   - 都道府県別フィルター
   - 加盟年別フィルター
   - キーワード検索

2. **詳細情報の追加**
   - 電話番号
   - ウェブサイト
   - 事業内容
   - 写真

3. **統計情報**
   - 都道府県別加盟店数
   - 年別加盟推移グラフ
   - ダッシュボード

4. **エクスポート機能**
   - CSV出力
   - PDF出力
   - 印刷用レイアウト

5. **編集・削除機能**
   - 加盟店情報の編集
   - 加盟店の削除
   - 履歴管理

## セキュリティ考慮事項

- RLS（Row Level Security）による認証済みユーザーのみアクセス可能
- APIキーは環境変数で管理
- .envファイルは.gitignoreに含める
- Service Role Keyは使用せず、Anon Keyのみ使用

## パフォーマンス最適化

- インデックスによる高速検索
- 地図のレイジーロード
- マーカーのクラスタリング（将来実装）

---

**作成者**: Claude Code
**最終更新**: 2025年10月26日
