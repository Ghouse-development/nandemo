import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Plus, X, Edit, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { supabase } from '../lib/supabaseClient';
import type { Store } from '../lib/types';
import { formatDate } from '../lib/utils';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// デフォルトマーカーアイコンの設定
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// 都道府県と市区町村から緯度経度を推定する簡易的な関数
const geocodeAddress = async (prefecture: string, city: string): Promise<{ lat: number; lng: number } | null> => {
  // 都道府県の中心座標（簡易版）
  const prefectureCoordinates: Record<string, { lat: number; lng: number }> = {
    '北海道': { lat: 43.064, lng: 141.347 },
    '青森県': { lat: 40.824, lng: 140.740 },
    '岩手県': { lat: 39.704, lng: 141.153 },
    '宮城県': { lat: 38.269, lng: 140.872 },
    '秋田県': { lat: 39.719, lng: 140.103 },
    '山形県': { lat: 38.240, lng: 140.364 },
    '福島県': { lat: 37.750, lng: 140.468 },
    '茨城県': { lat: 36.342, lng: 140.447 },
    '栃木県': { lat: 36.566, lng: 139.883 },
    '群馬県': { lat: 36.391, lng: 139.061 },
    '埼玉県': { lat: 35.857, lng: 139.649 },
    '千葉県': { lat: 35.605, lng: 140.123 },
    '東京都': { lat: 35.690, lng: 139.692 },
    '神奈川県': { lat: 35.448, lng: 139.643 },
    '新潟県': { lat: 37.902, lng: 139.023 },
    '富山県': { lat: 36.696, lng: 137.213 },
    '石川県': { lat: 36.595, lng: 136.626 },
    '福井県': { lat: 36.065, lng: 136.222 },
    '山梨県': { lat: 35.664, lng: 138.568 },
    '長野県': { lat: 36.651, lng: 138.181 },
    '岐阜県': { lat: 35.391, lng: 136.722 },
    '静岡県': { lat: 34.977, lng: 138.383 },
    '愛知県': { lat: 35.181, lng: 136.907 },
    '三重県': { lat: 34.730, lng: 136.509 },
    '滋賀県': { lat: 35.004, lng: 135.869 },
    '京都府': { lat: 35.021, lng: 135.756 },
    '大阪府': { lat: 34.686, lng: 135.520 },
    '兵庫県': { lat: 34.691, lng: 135.183 },
    '奈良県': { lat: 34.685, lng: 135.833 },
    '和歌山県': { lat: 34.226, lng: 135.167 },
    '鳥取県': { lat: 35.504, lng: 134.238 },
    '島根県': { lat: 35.472, lng: 133.051 },
    '岡山県': { lat: 34.662, lng: 133.935 },
    '広島県': { lat: 34.397, lng: 132.460 },
    '山口県': { lat: 34.186, lng: 131.471 },
    '徳島県': { lat: 34.066, lng: 134.559 },
    '香川県': { lat: 34.340, lng: 134.043 },
    '愛媛県': { lat: 33.842, lng: 132.766 },
    '高知県': { lat: 33.560, lng: 133.531 },
    '福岡県': { lat: 33.606, lng: 130.418 },
    '佐賀県': { lat: 33.249, lng: 130.300 },
    '長崎県': { lat: 32.745, lng: 129.874 },
    '熊本県': { lat: 32.790, lng: 130.742 },
    '大分県': { lat: 33.238, lng: 131.613 },
    '宮崎県': { lat: 31.911, lng: 131.424 },
    '鹿児島県': { lat: 31.560, lng: 130.558 },
    '沖縄県': { lat: 26.212, lng: 127.681 },
  };

  const coords = prefectureCoordinates[prefecture];
  if (!coords) return null;

  // 市区町村によって少しランダムにずらす（簡易版）
  const offset = 0.1;
  const randomLat = coords.lat + (Math.random() - 0.5) * offset;
  const randomLng = coords.lng + (Math.random() - 0.5) * offset;

  return { lat: randomLat, lng: randomLng };
};

export const StoreMap = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [deletingStoreId, setDeletingStoreId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    prefecture: '',
    city: '',
    address: '',
    joined_date: '',
  });

  // 加盟店データを取得
  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('joined_date', { ascending: false });

      if (error) throw error;
      setStores(data || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // 編集モードを開始
  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      prefecture: store.prefecture,
      city: store.city,
      address: store.address,
      joined_date: store.joined_date,
    });
    setShowForm(true);
  };

  // 削除処理
  const handleDelete = async (storeId: string) => {
    if (!window.confirm('本当にこの加盟店を削除しますか？')) {
      return;
    }

    setDeletingStoreId(storeId);
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', storeId);

      if (error) throw error;

      // データを再取得
      await fetchStores();
      alert('加盟店を削除しました');
    } catch (error) {
      console.error('Error deleting store:', error);
      alert('加盟店の削除に失敗しました');
    } finally {
      setDeletingStoreId(null);
    }
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 住所から緯度経度を取得
      const coords = await geocodeAddress(formData.prefecture, formData.city);

      const full_address = `${formData.prefecture}${formData.city}${formData.address}`;

      if (editingStore) {
        // 更新処理
        const { error } = await supabase
          .from('stores')
          .update({
            name: formData.name,
            prefecture: formData.prefecture,
            city: formData.city,
            address: formData.address,
            full_address,
            latitude: coords?.lat || null,
            longitude: coords?.lng || null,
            joined_date: formData.joined_date,
          })
          .eq('id', editingStore.id);

        if (error) throw error;
        alert('加盟店を更新しました');
      } else {
        // 追加処理
        const { error } = await supabase.from('stores').insert([
          {
            name: formData.name,
            prefecture: formData.prefecture,
            city: formData.city,
            address: formData.address,
            full_address,
            latitude: coords?.lat || null,
            longitude: coords?.lng || null,
            joined_date: formData.joined_date,
          },
        ]);

        if (error) throw error;
        alert('加盟店を追加しました');
      }

      // フォームをリセット
      setFormData({
        name: '',
        prefecture: '',
        city: '',
        address: '',
        joined_date: '',
      });
      setShowForm(false);
      setEditingStore(null);

      // データを再取得
      await fetchStores();
    } catch (error) {
      console.error('Error saving store:', error);
      alert(editingStore ? '加盟店の更新に失敗しました' : '加盟店の追加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // フォームをキャンセル
  const handleCancel = () => {
    setFormData({
      name: '',
      prefecture: '',
      city: '',
      address: '',
      joined_date: '',
    });
    setShowForm(false);
    setEditingStore(null);
  };

  // 地図の中心座標（日本の中心付近）
  const center: [number, number] = [36.5, 138.0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">GハウスVC加盟店一覧</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center space-x-2"
          >
            {showForm ? (
              <>
                <X className="w-5 h-5" />
                <span>キャンセル</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>加盟店追加</span>
              </>
            )}
          </button>
        </div>
        <p className="text-gray-600">全国の加盟店を地図上で確認できます</p>
      </div>

      {/* 加盟店追加・編集フォーム */}
      {showForm && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingStore ? '加盟店情報を編集' : '加盟店情報を入力'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                工務店名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  都道府県 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.prefecture}
                  onChange={(e) => setFormData({ ...formData, prefecture: e.target.value })}
                  className="input"
                  placeholder="例: 東京都"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  市区町村 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input"
                  placeholder="例: 渋谷区"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                住所（市区町村以降）
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input"
                placeholder="例: 道玄坂1-2-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                加盟年月日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.joined_date}
                onChange={(e) => setFormData({ ...formData, joined_date: e.target.value })}
                className="input"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading
                  ? (editingStore ? '更新中...' : '追加中...')
                  : (editingStore ? '更新' : '追加')
                }
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary flex-1"
              >
                キャンセル
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* 地図表示 */}
      <Card className="overflow-hidden">
        <div className="h-[600px] relative">
          <MapContainer
            center={center}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
          >
            {/* CartoDB Positron - シンプルな白地図 */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={20}
            />

            {stores.map((store) => {
              if (!store.latitude || !store.longitude) return null;

              return (
                <Marker
                  key={store.id}
                  position={[store.latitude, store.longitude]}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-lg mb-2">{store.name}</h3>
                      <div className="space-y-1 text-sm">
                        <p className="flex items-start">
                          <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{store.full_address}</span>
                        </p>
                        <p className="text-gray-600">
                          加盟年月日: {formatDate(store.joined_date)}
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </Card>

      {/* 加盟店一覧テーブル */}
      <Card className="mt-6">
        <h2 className="text-xl font-semibold mb-4">加盟店一覧 ({stores.length}店舗)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  工務店名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  都道府県
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  市区町村
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  加盟年月日
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {store.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {store.prefecture}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {store.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(store.joined_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(store)}
                        className="text-indigo-600 hover:text-indigo-900 p-2 rounded hover:bg-indigo-50 transition-colors"
                        title="編集"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(store.id)}
                        disabled={deletingStoreId === store.id}
                        className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">加盟店がまだ登録されていません</p>
          </div>
        )}
      </Card>
    </div>
  );
};
