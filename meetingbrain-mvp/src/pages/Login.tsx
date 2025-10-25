import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, getCurrentUser, isAllowedDomain } from '../lib/supabaseClient';

/**
 * Login page with Google SSO
 */
export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (user && isAllowedDomain(user.email)) {
      navigate('/library');
    }
    // Auto-redirect to library in demo mode
    else if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
      setTimeout(() => {
        navigate('/library');
      }, 500);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('ログインに失敗しました。もう一度お試しください。');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-accent-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <span className="font-bold text-3xl text-gray-900">MeetingBrain</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            会議の知識を、チームの力に
          </h2>
          <p className="text-gray-600">
            音声ファイルをアップロードして、会議の内容を検索・活用しましょう
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium text-gray-700">
              {loading ? 'ログイン中...' : 'Googleでログイン'}
            </span>
          </button>

          <p className="mt-4 text-xs text-gray-500 text-center">
            ※ 組織のGoogleアカウント（@{import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN || 'g-house.co.jp'}）でのみログイン可能です
          </p>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          利用規約とプライバシーポリシーに同意の上、ログインしてください
        </p>
      </div>
    </div>
  );
};