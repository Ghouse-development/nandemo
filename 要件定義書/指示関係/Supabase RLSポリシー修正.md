# Supabase RLSポリシー修正手順

## 問題
401エラーが発生し、加盟店の追加に失敗します。

## 原因
- Supabaseのstoresテーブルで`authenticated`（認証済みユーザー）のみアクセス可能
- 開発環境で`VITE_SKIP_AUTH=true`設定により認証をスキップ
- 認証トークンがないため、Supabaseへのリクエストが拒否される

## 解決策：RLSポリシーを修正

### 手順1: Supabase SQLエディタを開く

1. ブラウザで以下のURLを開く
   ```
   https://twzsirpfudqwboeyakta.supabase.co
   ```

2. 左メニューの「SQL Editor」をクリック

### 手順2: 既存のポリシーを削除

以下のSQLを実行：

```sql
-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Authenticated users can view stores" ON stores;
DROP POLICY IF EXISTS "Authenticated users can insert stores" ON stores;
DROP POLICY IF EXISTS "Authenticated users can update stores" ON stores;
DROP POLICY IF EXISTS "Authenticated users can delete stores" ON stores;
```

### 手順3: 新しいポリシーを作成（匿名アクセス許可）

以下のSQLを実行：

```sql
-- 全てのユーザー（匿名含む）が閲覧可能
CREATE POLICY "Anyone can view stores"
  ON stores FOR SELECT
  USING (true);

-- 全てのユーザー（匿名含む）が追加可能
CREATE POLICY "Anyone can insert stores"
  ON stores FOR INSERT
  WITH CHECK (true);

-- 全てのユーザー（匿名含む）が更新可能
CREATE POLICY "Anyone can update stores"
  ON stores FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 全てのユーザー（匿名含む）が削除可能
CREATE POLICY "Anyone can delete stores"
  ON stores FOR DELETE
  USING (true);
```

### 手順4: 確認

1. 「Run」ボタンをクリック
2. 成功メッセージが表示されることを確認

## セキュリティ上の注意

⚠️ **この設定は開発・テスト用です**

本番環境では以下のような制限を推奨：
1. 認証済みユーザーのみアクセス可能
2. 特定のドメインのユーザーのみアクセス可能
3. 編集・削除は管理者のみ可能

### 本番環境用ポリシー例

```sql
-- 閲覧: 全員可能
CREATE POLICY "Anyone can view stores"
  ON stores FOR SELECT
  USING (true);

-- 追加・編集・削除: 認証済みユーザーのみ
CREATE POLICY "Authenticated users can modify stores"
  ON stores FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

---

**作成日**: 2025年10月26日
