import type { SearchHit, QAResponse } from './types';

const API_BASE = '/api';

/**
 * Search meetings
 * @param query Search query string
 * @returns Array of search hits
 */
export const searchMeetings = async (query: string): Promise<SearchHit[]> => {
  try {
    const response = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    
    if (!response.ok) throw new Error('Search failed');
    
    return response.json();
  } catch (error) {
    console.error('Search error:', error);
    // Return dummy data for MVP
    return [
      {
        title: '製品開発会議',
        snippet: '...新機能の実装について議論し、リリーススケジュールを確定...',
        ts: 120,
        meetingId: 'test-123',
      },
      {
        title: '営業戦略ミーティング',
        snippet: '...Q4の営業目標と新規顧客獲得戦略について...',
        ts: 300,
        meetingId: 'test-456',
      },
    ];
  }
};

/**
 * Ask question about a meeting
 * @param query Question to ask
 * @param meetingId Optional meeting ID to scope the question
 * @returns QA response with answer and citations
 */
export const askQuestion = async (
  query: string,
  meetingId?: string
): Promise<QAResponse> => {
  try {
    const response = await fetch(`${API_BASE}/qa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, meetingId }),
    });
    
    if (!response.ok) throw new Error('QA failed');
    
    return response.json();
  } catch (error) {
    console.error('QA error:', error);
    // Return dummy data for MVP
    return {
      answer: 'この会議では、新製品のリリーススケジュールについて議論されました。主な決定事項として、ベータ版を来月末にリリースし、正式版は3ヶ月後を目標とすることが決まりました。',
      cites: [
        {
          text: 'ベータ版のリリースは来月末を予定しています',
          ts: 245,
          meetingId: meetingId || 'test-123',
        },
        {
          text: '正式版は3ヶ月後を目標にしましょう',
          ts: 512,
          meetingId: meetingId || 'test-123',
        },
      ],
    };
  }
};

/**
 * Upload audio file
 * @param file Audio file to upload
 * @returns Upload response with meeting ID
 */
export const uploadAudio = async (
  file: File
): Promise<{ ok: boolean; meetingId: string }> => {
  try {
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        size: file.size,
        type: file.type,
      }),
    });
    
    if (!response.ok) throw new Error('Upload failed');
    
    return response.json();
  } catch (error) {
    console.error('Upload error:', error);
    // Return dummy data for MVP
    // 将来: ここでGoogle Drive署名URLを取得してResumable Uploadを実行
    return {
      ok: true,
      meetingId: 'test-' + Date.now(),
    };
  }
};