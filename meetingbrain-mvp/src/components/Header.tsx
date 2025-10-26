import { MapPin } from 'lucide-react';

/**
 * Simple header component for GハウスVC加盟店管理システム
 */
export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <MapPin className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                GハウスVC加盟店管理システム
              </h1>
              <p className="text-xs text-gray-500">
                全国の加盟店を地図で管理
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
