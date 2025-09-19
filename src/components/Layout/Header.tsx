import React from 'react';
import { LogOut, User, Bell, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Header: React.FC = () => {
  const { user, signOut, isDemoMode } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">FinSight</h1>
          </div>

          {isDemoMode && (
            <div className="hidden sm:flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Demo Mode
            </div>
          )}

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings size={20} />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.displayName || user?.email}
                    {isDemoMode && ' (Demo)'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={signOut}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Sign out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};