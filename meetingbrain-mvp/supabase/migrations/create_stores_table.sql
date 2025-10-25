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
