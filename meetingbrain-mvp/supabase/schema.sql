-- MeetingBrain MVP Database Schema
-- 将来: pgvectorエクステンションを有効化
-- CREATE EXTENSION IF NOT EXISTS vector;

-- Meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  owner_id UUID NOT NULL,
  visibility TEXT DEFAULT 'company' CHECK (visibility IN ('private', 'company', 'public')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media files table
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  duration_sec INTEGER,
  size_bytes BIGINT,
  mime TEXT,
  path TEXT, -- 将来: Google Drive file ID
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transcripts table
CREATE TABLE IF NOT EXISTS transcript (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  language TEXT DEFAULT 'ja',
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transcript chunks for timeline navigation
CREATE TABLE IF NOT EXISTS chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  segment_start_sec INTEGER NOT NULL,
  segment_end_sec INTEGER NOT NULL,
  text TEXT NOT NULL,
  speaker TEXT, -- Speaker identification (A, B, C, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- 将来: embedding VECTOR(1536) -- OpenAI embeddings
);

-- Meeting summaries
CREATE TABLE IF NOT EXISTS summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  tldr TEXT,
  bullets TEXT[],
  decisions TEXT[],
  todos TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_meetings_owner_id ON meetings(owner_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(date DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_visibility ON meetings(visibility);
CREATE INDEX IF NOT EXISTS idx_media_meeting_id ON media(meeting_id);
CREATE INDEX IF NOT EXISTS idx_transcript_meeting_id ON transcript(meeting_id);
CREATE INDEX IF NOT EXISTS idx_chunks_meeting_id ON chunks(meeting_id);
CREATE INDEX IF NOT EXISTS idx_chunks_segment_start ON chunks(segment_start_sec);
CREATE INDEX IF NOT EXISTS idx_summaries_meeting_id ON summaries(meeting_id);

-- 将来: pgvector用のインデックス
-- CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON chunks USING ivfflat (embedding vector_cosine_ops);

-- RLS (Row Level Security) Policies
-- 本番環境では以下のポリシーを有効化

-- ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE media ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transcript ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chunks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own private meetings
-- CREATE POLICY "Users can view own private meetings" ON meetings
--   FOR SELECT
--   USING (
--     owner_id = auth.uid() 
--     OR visibility = 'public' 
--     OR (visibility = 'company' AND auth.jwt() ->> 'email' LIKE '%@g-house.co.jp')
--   );

-- Policy: Users can create meetings
-- CREATE POLICY "Users can create meetings" ON meetings
--   FOR INSERT
--   WITH CHECK (owner_id = auth.uid());

-- Policy: Users can update their own meetings
-- CREATE POLICY "Users can update own meetings" ON meetings
--   FOR UPDATE
--   USING (owner_id = auth.uid());

-- Policy: Users can delete their own meetings
-- CREATE POLICY "Users can delete own meetings" ON meetings
--   FOR DELETE
--   USING (owner_id = auth.uid());

-- Similar policies for other tables...
-- CREATE POLICY "Users can view meeting media" ON media
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM meetings 
--       WHERE meetings.id = media.meeting_id 
--       AND (
--         meetings.owner_id = auth.uid() 
--         OR meetings.visibility = 'public' 
--         OR (meetings.visibility = 'company' AND auth.jwt() ->> 'email' LIKE '%@g-house.co.jp')
--       )
--     )
--   );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();