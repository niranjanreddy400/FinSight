import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { LogIn, Moon, Sun, TrendingUp, PieChart, Target, Shield } from 'lucide-react';

export const LoginScreen = () => {
  const { signInWithGoogle } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              ExpenseFlow
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Smart expense tracking for modern life
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center p-4">
              <PieChart size={24} className="mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Visual Analytics</p>
            </div>
            <div className="text-center p-4">
              <Target size={24} className="mx-auto mb-2 text-green-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Budget Tracking</p>
            </div>
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <LogIn size={20} />
            Continue with Google
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Shield size={16} />
            Secured by Firebase Authentication
          </div>
        </div>
      </div>
    </div>
  );
};