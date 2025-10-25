import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Send } from 'lucide-react';
import { Card } from '../components/Card';
import { AudioPlayer } from '../components/AudioPlayer';
import { formatDate, formatDuration } from '../lib/utils';
import { askQuestion } from '../lib/api';
import type { Meeting, Chunk, QAResponse } from '../lib/types';

/**
 * Meeting detail page with tabs for summary, transcript, and Q&A
 */
export const MeetingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'transcript' | 'qa'>('summary');
  const [question, setQuestion] = useState('');
  const [qaResponse, setQaResponse] = useState<QAResponse | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    // Load dummy meeting data for MVP
    // 将来: ここでSupabaseからデータを取得
    const dummyMeeting: Meeting = {
      id: id || 'test-123',
      title: '製品開発会議 - Q4ロードマップ',
      date: '2024-01-15',
      tags: ['開発', 'ロードマップ', 'Q4'],
      owner_id: 'user-1',
      visibility: 'company',
      created_at: '2024-01-15T10:00:00Z',
      summary: {
        id: 'sum-1',
        meeting_id: id || 'test-123',
        tldr: '新製品のベータ版を来月末にリリース、正式版は3ヶ月後を目標とする。主要機能の実装は完了し、現在はテストフェーズに移行中。',
        bullets: [
          'ベータ版リリース：来月末（2月末）予定',
          '正式版リリース：3ヶ月後（4月末）目標',
          '主要機能の実装完了率：85%',
          'ユーザーテスト参加者：50名募集中',
          'パフォーマンス改善：レスポンス時間30%短縮達成',
        ],
        decisions: [
          'ベータ版のスコープを確定：コア機能のみに絞る',
          'マーケティングチームと連携してローンチ準備開始',
          '追加予算50万円の承認',
        ],
        todos: [
          'ベータテスターの募集と選定（担当：田中）',
          'ドキュメント整備（担当：佐藤）',
          'パフォーマンステスト実施（担当：鈴木）',
        ],
      },
      media: {
        id: 'media-1',
        meeting_id: id || 'test-123',
        duration_sec: 3600,
        size_bytes: 50000000,
        mime: 'audio/mpeg',
        path: '/sample.mp3',
        created_at: '2024-01-15T10:00:00Z',
      },
      transcript: {
        id: 'trans-1',
        meeting_id: id || 'test-123',
        language: 'ja',
        text: '',
        created_at: '2024-01-15T11:00:00Z',
        chunks: [
          {
            id: 'chunk-1',
            meeting_id: id || 'test-123',
            segment_start_sec: 0,
            segment_end_sec: 30,
            text: '皆さん、おはようございます。今日は製品開発会議ということで、Q4のロードマップについて話し合いたいと思います。',
            speaker: 'A',
          },
          {
            id: 'chunk-2',
            meeting_id: id || 'test-123',
            segment_start_sec: 30,
            segment_end_sec: 60,
            text: 'まず、ベータ版のリリースについてですが、来月末を予定しています。主要機能の実装はほぼ完了しており、現在はテストフェーズに入っています。',
            speaker: 'A',
          },
          {
            id: 'chunk-3',
            meeting_id: id || 'test-123',
            segment_start_sec: 60,
            segment_end_sec: 90,
            text: 'テストの進捗はどうですか？予定通り進んでいますか？',
            speaker: 'B',
          },
          {
            id: 'chunk-4',
            meeting_id: id || 'test-123',
            segment_start_sec: 90,
            segment_end_sec: 120,
            text: 'はい、順調に進んでいます。ユニットテストは95%完了、統合テストは70%完了しています。来週中にはすべて完了予定です。',
            speaker: 'C',
          },
          {
            id: 'chunk-5',
            meeting_id: id || 'test-123',
            segment_start_sec: 120,
            segment_end_sec: 150,
            text: 'パフォーマンスについても改善が見られました。レスポンス時間を30%短縮することができました。',
            speaker: 'C',
          },
        ],
      },
    };
    
    setMeeting(dummyMeeting);
  }, [id]);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsAsking(true);
    try {
      const response = await askQuestion(question, meeting?.id);
      setQaResponse(response);
    } catch (error) {
      console.error('Failed to ask question:', error);
    } finally {
      setIsAsking(false);
    }
  };

  const getSpeakerColor = (speaker?: string): string => {
    const colors: Record<string, string> = {
      'A': 'border-blue-200 bg-blue-50',
      'B': 'border-green-200 bg-green-50',
      'C': 'border-purple-200 bg-purple-50',
    };
    return colors[speaker || 'A'] || 'border-gray-200 bg-gray-50';
  };

  if (!meeting) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/library')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>ライブラリに戻る</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{meeting.title}</h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(meeting.date)}</span>
              </div>
              {meeting.media && (
                <span>長さ: {formatDuration(meeting.media.duration_sec)}</span>
              )}
            </div>

            {meeting.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {meeting.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'summary'
                      ? 'border-accent-600 text-accent-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  要約
                </button>
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'transcript'
                      ? 'border-accent-600 text-accent-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  全文
                </button>
                <button
                  onClick={() => setActiveTab('qa')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'qa'
                      ? 'border-accent-600 text-accent-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Q&A
                </button>
              </nav>
            </div>
          </div>

          <div className="mt-6">
            {activeTab === 'summary' && meeting.summary && (
              <div className="space-y-6">
                <Card>
                  <h3 className="font-semibold text-gray-900 mb-3">TL;DR</h3>
                  <p className="text-gray-700">{meeting.summary.tldr}</p>
                </Card>

                <Card>
                  <h3 className="font-semibold text-gray-900 mb-3">要点</h3>
                  <ul className="space-y-2">
                    {meeting.summary.bullets.map((bullet, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-accent-600 mr-2">•</span>
                        <span className="text-gray-700">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card>
                  <h3 className="font-semibold text-gray-900 mb-3">決定事項</h3>
                  <ul className="space-y-2">
                    {meeting.summary.decisions.map((decision, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">{decision}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card>
                  <h3 className="font-semibold text-gray-900 mb-3">ToDo</h3>
                  <ul className="space-y-2">
                    {meeting.summary.todos.map((todo, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">□</span>
                        <span className="text-gray-700">{todo}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}

            {activeTab === 'transcript' && meeting.transcript?.chunks && (
              <div className="space-y-3">
                {meeting.transcript.chunks.map((chunk: Chunk) => (
                  <div
                    key={chunk.id}
                    className={`p-3 rounded-lg border ${getSpeakerColor(chunk.speaker)}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">
                        話者 {chunk.speaker}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDuration(chunk.segment_start_sec)} - {formatDuration(chunk.segment_end_sec)}
                      </span>
                    </div>
                    <p className="text-gray-800">{chunk.text}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="space-y-6">
                <Card>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                      placeholder="会議について質問してください..."
                      className="input flex-1"
                      disabled={isAsking}
                    />
                    <button
                      onClick={handleAskQuestion}
                      disabled={isAsking || !question.trim()}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isAsking ? '処理中...' : '送信'}</span>
                    </button>
                  </div>
                </Card>

                {qaResponse && (
                  <Card>
                    <h3 className="font-semibold text-gray-900 mb-3">回答</h3>
                    <p className="text-gray-700 mb-4">{qaResponse.answer}</p>
                    
                    {qaResponse.cites.length > 0 && (
                      <>
                        <h4 className="font-medium text-gray-700 mb-2">引用箇所</h4>
                        <div className="space-y-2">
                          {qaResponse.cites.map((cite, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded border border-gray-200">
                              <p className="text-sm text-gray-600 mb-1">
                                {formatDuration(cite.ts)}
                              </p>
                              <p className="text-sm text-gray-800">{cite.text}</p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <AudioPlayer className="mb-6" />
            
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">会議情報</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">日付</dt>
                  <dd className="text-gray-900">{formatDate(meeting.date)}</dd>
                </div>
                {meeting.media && (
                  <>
                    <div>
                      <dt className="text-gray-500">長さ</dt>
                      <dd className="text-gray-900">{formatDuration(meeting.media.duration_sec)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">ファイルサイズ</dt>
                      <dd className="text-gray-900">
                        {Math.round(meeting.media.size_bytes / 1024 / 1024)} MB
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};