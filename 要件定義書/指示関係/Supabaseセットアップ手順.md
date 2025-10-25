# Supabaseセットアップ手順

## 1. Supabaseダッシュボードへのアクセス

1. ブラウザで以下のURLにアクセス
   ```
   https://twzsirpfudqwboeyakta.supabase.co
   ```

2. Supabaseにログイン

## 2. SQLエディタでテーブルを作成

### 手順

1. 左側のメニューから「SQL Editor」をクリック
2. 「New query」をクリック
3. 以下のSQLをコピー＆ペーストして実行

### 実行するSQL

```sql
-- GハウスVC加盟店テーブル
CREATE TABLE IF NOT EXISTS stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  prefecture TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  full_address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  joined_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_stores_prefecture ON stores(prefecture);
CREATE INDEX IF NOT EXISTS idx_stores_city ON stores(city);
CREATE INDEX IF NOT EXISTS idx_stores_location ON stores(latitude, longitude);

-- Row Level Security (RLS) の有効化
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーは全ての加盟店を閲覧可能
CREATE POLICY "Authenticated users can view stores"
  ON stores FOR SELECT
  TO authenticated
  USING (true);

-- 認証済みユーザーは加盟店を追加可能
CREATE POLICY "Authenticated users can insert stores"
  ON stores FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 認証済みユーザーは加盟店を更新可能
CREATE POLICY "Authenticated users can update stores"
  ON stores FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 認証済みユーザーは加盟店を削除可能
CREATE POLICY "Authenticated users can delete stores"
  ON stores FOR DELETE
  TO authenticated
  USING (true);

-- 更新日時を自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 4. 実行確認

1. 「Run」ボタンをクリック
2. 成功メッセージが表示されることを確認
3. 左側のメニューから「Table Editor」をクリック
4. 「stores」テーブルが作成されていることを確認

## 3. テーブル構造の確認

### カラム一覧

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PRIMARY KEY | 自動生成されるID |
| name | TEXT | NOT NULL | 工務店名 |
| prefecture | TEXT | NOT NULL | 都道府県 |
| city | TEXT | NOT NULL | 市区町村 |
| address | TEXT | NOT NULL | 住所詳細 |
| full_address | TEXT | NOT NULL | 完全な住所 |
| latitude | DECIMAL(10, 8) | | 緯度 |
| longitude | DECIMAL(11, 8) | | 経度 |
| joined_date | DATE | NOT NULL | 加盟年月日 |
| created_at | TIMESTAMP | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新日時 |

## 4. サンプルデータの投入（オプション）

テスト用にサンプルデータを投入する場合は、以下のSQLを実行：

```sql
INSERT INTO stores (name, prefecture, city, address, full_address, latitude, longitude, joined_date) VALUES
('東京工務店', '東京都', '渋谷区', '道玄坂1-2-3', '東京都渋谷区道玄坂1-2-3', 35.6596, 139.7003, '2024-01-15'),
('大阪建設', '大阪府', '大阪市', '中央区1-1-1', '大阪府大阪市中央区1-1-1', 34.6937, 135.5023, '2024-02-20'),
('福岡ホームズ', '福岡県', '福岡市', '博多区2-3-4', '福岡県福岡市博多区2-3-4', 33.5904, 130.4017, '2024-03-10');
```

## 5. 認証設定の確認

### Google OAuth設定（既に設定済みの場合はスキップ）

1. 左側のメニューから「Authentication」→「Providers」をクリック
2. 「Google」を有効化
3. Google Cloud ConsoleでOAuth 2.0クライアントIDを作成
4. クライアントIDとシークレットをSupabaseに設定

### ドメイン制限（g-house.co.jp）

アプリケーション側で既に実装済みのため、追加設定は不要です。

## 6. トラブルシューティング

### エラー: "relation already exists"
→ テーブルが既に存在しています。削除してから再度実行するか、`CREATE TABLE IF NOT EXISTS`を使用してください。

### エラー: "permission denied"
→ 適切な権限がない可能性があります。プロジェクトオーナーでログインしているか確認してください。

### RLSポリシーが機能しない
→ `ALTER TABLE stores ENABLE ROW LEVEL SECURITY;` が実行されているか確認してください。

## 7. 次のステップ

1. ✅ Supabaseテーブル作成完了
2. ✅ 環境変数設定完了（.envファイル）
3. ✅ アプリケーション実装完了
4. → アプリケーションを起動して動作確認

```bash
cd meetingbrain-mvp
npm run dev
```

アプリケーションが起動したら、以下のURLにアクセス：
- http://localhost:3456/stores

---

**作成日**: 2025年10月26日
**プロジェクトURL**: https://twzsirpfudqwboeyakta.supabase.co
