import { useState } from 'react';
import { 
  BarChart3, 
  Plus, 
  Target, 
  Download, 
  Home, 
  Menu, 
  X, 
  TrendingUp,
  CreditCard,
  PieChart,
  Settings
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-blue-600' },
    { id: 'transactions', label: 'Transactions', icon: CreditCard, color: 'text-green-600' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-purple-600' },
    { id: 'insights', label: 'AI Insights', icon: TrendingUp, color: 'text-indigo-600' },
    { id: 'budget', label: 'Budget', icon: Target, color: 'text-orange-600' },
    { id: 'reports', label: 'Reports', icon: PieChart, color: 'text-pink-600' },
    { id: 'export', label: 'Export', icon: Download, color: 'text-gray-600' },
  ];

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const handleViewChange = (view: string) => {
    onViewChange(view);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 top-16
        w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 pt-8">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon 
                    size={18} 
                    className={isActive ? item.color : 'text-gray-500 dark:text-gray-400'} 
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Quick Stats
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">This Month</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">$2,450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Savings</span>
                <span className="font-medium text-green-600 dark:text-green-400">$850</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};