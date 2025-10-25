import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Calendar, Tag, MapPin } from 'lucide-react';
import { Card } from '../components/Card';
import { formatDate, truncateText } from '../lib/utils';
import type { Meeting } from '../lib/types';

/**
 * Library page showing all meetings
 */
export const Library = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load dummy meetings for MVP
    const dummyMeetings: Meeting[] = [
      {
        id: 'test-123',
        title: '製品開発会議 - Q4ロードマップ',
        date: '2024-01-15',
        tags: ['開発', 'ロードマップ', 'Q4'],
        owner_id: 'user-1',
        visibility: 'company',
        created_at: '2024-01-15T10:00:00Z',
        summary: {
          id: 'sum-1',
          meeting_id: 'test-123',
          tldr: '新製品のベータ版を来月末にリリース、正式版は3ヶ月後を目標とする',
          bullets: [],
          decisions: [],
          todos: [],
        },
      },
      {
        id: 'test-456',
        title: '営業戦略ミーティング',
        date: '2024-01-10',
        tags: ['営業', '戦略', 'Q1'],
        owner_id: 'user-1',
        visibility: 'company',
        created_at: '2024-01-10T14:00:00Z',
        summary: {
          id: 'sum-2',
          meeting_id: 'test-456',
          tldr: 'Q1の営業目標を20%上方修正、新規顧客獲得に注力',
          bullets: [],
          decisions: [],
          todos: [],
        },
      },
      {
        id: 'test-789',
        title: 'デザインレビュー - UIリニューアル',
        date: '2024-01-08',
        tags: ['デザイン', 'UI/UX', 'レビュー'],
        owner_id: 'user-1',
        visibility: 'company',
        created_at: '2024-01-08T11:00:00Z',
        summary: {
          id: 'sum-3',
          meeting_id: 'test-789',
          tldr: 'モバイルファーストのアプローチを採用、ダークモード対応を優先',
          bullets: [],
          decisions: [],
          todos: [],
        },
      },
    ];
    
    setMeetings(dummyMeetings);
    setFilteredMeetings(dummyMeetings);
  }, []);

  useEffect(() => {
    // Filter meetings based on search query
    if (searchQuery.trim() === '') {
      setFilteredMeetings(meetings);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = meetings.filter(meeting => 
        meeting.title.toLowerCase().includes(query) ||
        meeting.tags.some(tag => tag.toLowerCase().includes(query)) ||
        meeting.summary?.tldr.toLowerCase().includes(query)
      );
      setFilteredMeetings(filtered);
    }
  }, [searchQuery, meetings]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">会議ライブラリ</h1>
        <p className="text-gray-600">録音された会議の内容を検索・確認できます</p>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="会議を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button
          onClick={() => navigate('/upload')}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>アップロード</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* GハウスVC加盟店一覧カード */}
        <Card
          onClick={() => navigate('/stores')}
          className="hover:border-accent-200 bg-gradient-to-br from-blue-50 to-indigo-50"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <MapPin className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              GハウスVC加盟店一覧
            </h3>
          </div>

          <p className="text-sm text-gray-600 mb-3">
            全国の加盟店を地図上で確認できます。住所を入力して新しい加盟店を追加することも可能です。
          </p>

          <div className="flex items-center space-x-2 text-sm text-indigo-600 font-medium">
            <span>地図を開く</span>
            <span>→</span>
          </div>
        </Card>

        {filteredMeetings.map((meeting) => (
          <Card
            key={meeting.id}
            onClick={() => navigate(`/meetings/${meeting.id}`)}
            className="hover:border-accent-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {meeting.title}
            </h3>
            
            <p className="text-sm text-gray-600 mb-3">
              {truncateText(meeting.summary?.tldr || '', 80)}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(meeting.date)}</span>
              </div>
            </div>
            
            {meeting.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
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
          </Card>
        ))}
      </div>

      {filteredMeetings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? '検索結果が見つかりませんでした' : '会議がありません'}
          </p>
        </div>
      )}
    </div>
  );
};