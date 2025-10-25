/**
 * Type definitions for MeetingBrain MVP
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  tags: string[];
  owner_id: string;
  visibility: 'private' | 'company' | 'public';
  created_at: string;
  summary?: Summary;
  media?: Media;
  transcript?: Transcript;
}

export interface Media {
  id: string;
  meeting_id: string;
  duration_sec: number;
  size_bytes: number;
  mime: string;
  path: string;
  created_at: string;
}

export interface Transcript {
  id: string;
  meeting_id: string;
  language: string;
  text: string;
  created_at: string;
  chunks?: Chunk[];
}

export interface Chunk {
  id: string;
  meeting_id: string;
  segment_start_sec: number;
  segment_end_sec: number;
  text: string;
  speaker?: string;
}

export interface Summary {
  id: string;
  meeting_id: string;
  tldr: string;
  bullets: string[];
  decisions: string[];
  todos: string[];
}

export interface SearchHit {
  title: string;
  snippet: string;
  ts: number;
  meetingId: string;
}

export interface QAResponse {
  answer: string;
  cites: Array<{
    text: string;
    ts: number;
    meetingId: string;
  }>;
}

export interface UploadProgress {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
}

export interface Store {
  id: string;
  name: string;
  prefecture: string;
  city: string;
  address: string;
  full_address: string;
  latitude: number | null;
  longitude: number | null;
  joined_date: string;
  created_at: string;
  updated_at: string;
}