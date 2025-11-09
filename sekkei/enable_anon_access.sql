-- =====================================================
-- anonロールにもSELECT権限を付与（テスト用）
-- 注意: 本番環境では認証なしでのアクセスを許可すべきではありません
-- =====================================================

-- 既存のanonポリシーを削除
DROP POLICY IF EXISTS "designers_anon_select" ON designers;
DROP POLICY IF EXISTS "email_templates_anon_select" ON email_templates;
DROP POLICY IF EXISTS "template_vendors_anon_select" ON template_vendors;
DROP POLICY IF EXISTS "task_template_mappings_anon_select" ON task_template_mappings;

-- anonロールにSELECT権限を付与
CREATE POLICY "designers_anon_select" ON designers
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "email_templates_anon_select" ON email_templates
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "template_vendors_anon_select" ON template_vendors
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "task_template_mappings_anon_select" ON task_template_mappings
  FOR SELECT
  TO anon
  USING (true);

-- 確認
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND roles && ARRAY['anon']
ORDER BY tablename, policyname;
