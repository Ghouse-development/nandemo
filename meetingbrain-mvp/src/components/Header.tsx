import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';
import { getCurrentUser, signOut } from '../lib/supabaseClient';
import type { User } from '../lib/types';

/**
 * Application header with logo and user menu
 */
export const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/library" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-semibold text-xl text-gray-900">MeetingBrain</span>
          </Link>

          {user && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name || user.email}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-600" />
                  </div>
                )}
                <span className="text-sm text-gray-700">{user.name || user.email}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>ログアウト</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};