# Vercel デプロイ手順

## デプロイ完了

GitHubにプッシュし、Vercelにデプロイしました！

## 本番URL

```
https://meetingbrain-barj7ep40-ghouse-developments-projects.vercel.app
```

## 重要: 環境変数の設定

アプリケーションが正常に動作するためには、Vercelで環境変数を設定する必要があります。

### 手順

1. **Vercelダッシュボードにアクセス**
   ```
   https://vercel.com/ghouse-developments-projects/meetingbrain-mvp
   ```

2. **Settings → Environment Variables**
   - 左メニューの「Settings」をクリック
   - 「Environment Variables」タブをクリック

3. **以下の環境変数を追加**

   #### VITE_SUPABASE_URL
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: `https://twzsirpfudqwboeyakta.supabase.co`
   - **Environment**: Production, Preview, Development (全てチェック)
   - 「Add」をクリック

   #### VITE_SUPABASE_ANON_KEY
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3enNpcnBmdWRxd2JvZXlha3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MzM4NjgsImV4cCI6MjA3NzAwOTg2OH0.E_8GxfsO6Scjc0dDoEoyxq3i4lfvNxYZvnSL1OlSDSM`
   - **Environment**: Production, Preview, Development (全てチェック)
   - 「Add」をクリック

   #### VITE_ALLOWED_EMAIL_DOMAIN
   - **Key**: `VITE_ALLOWED_EMAIL_DOMAIN`
   - **Value**: `g-house.co.jp`
   - **Environment**: Production, Preview, Development (全てチェック)
   - 「Add」をクリック

   #### VITE_SKIP_AUTH
   - **Key**: `VITE_SKIP_AUTH`
   - **Value**: `true`
   - **Environment**: Production, Preview, Development (全てチェック)
   - 「Add」をクリック

4. **再デプロイ**
   - 環境変数を追加後、自動的に再デプロイされます
   - または、「Deployments」タブから最新のデプロイを選択し、「Redeploy」をクリック

## 代替方法: CLIで環境変数を設定

コマンドラインで設定する場合:

```bash
cd meetingbrain-mvp

vercel env add VITE_SUPABASE_URL production
# 値を入力: https://twzsirpfudqwboeyakta.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# 値を入力: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3enNpcnBmdWRxd2JvZXlha3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MzM4NjgsImV4cCI6MjA3NzAwOTg2OH0.E_8GxfsO6Scjc0dDoEoyxq3i4lfvNxYZvnSL1OlSDSM

vercel env add VITE_ALLOWED_EMAIL_DOMAIN production
# 値を入力: g-house.co.jp

vercel env add VITE_SKIP_AUTH production
# 値を入力: true

# 再デプロイ
vercel --prod
```

## カスタムドメインの設定（オプション）

独自ドメインを使用したい場合:

1. Vercelダッシュボードで「Settings」→「Domains」
2. 「Add Domain」をクリック
3. ドメイン名を入力（例: `nandemo.g-house.co.jp`）
4. DNSレコードを設定（Vercelが指示を表示）

## デプロイ情報

- **GitHub リポジトリ**: https://github.com/Ghouse-development/nandemo
- **Vercel プロジェクト**: ghouse-developments-projects/meetingbrain-mvp
- **フレームワーク**: Vite + React + TypeScript
- **ビルドコマンド**: `vite build`
- **出力ディレクトリ**: `dist`

## トラブルシューティング

### アプリケーションが表示されない
→ 環境変数が正しく設定されているか確認

### 加盟店が追加できない
→ Supabaseの環境変数が正しいか確認
→ SupabaseのRLSポリシーが設定されているか確認

### 地図が表示されない
→ ブラウザのコンソールでエラーを確認
→ Leaflet CSSが読み込まれているか確認

## 今後の改善

1. カスタムドメインの設定
2. 認証の有効化（本番環境用）
3. パフォーマンス最適化
4. SEO対策

---

**デプロイ日**: 2025年10月26日
**本番URL**: https://meetingbrain-barj7ep40-ghouse-developments-projects.vercel.app
