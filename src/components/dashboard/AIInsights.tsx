import { Brain, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { AnalyticsData } from '../../types';

interface AIInsightsProps {
  analyticsData: AnalyticsData | null;
  loading: boolean;
}

export const AIInsights = ({ analyticsData, loading }: AIInsightsProps) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Brain className="text-purple-600 dark:text-purple-400" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Financial Insights
          </h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-purple-200 dark:bg-purple-800 rounded w-3/4"></div>
          <div className="h-4 bg-purple-200 dark:bg-purple-800 rounded w-1/2"></div>
          <div className="h-4 bg-purple-200 dark:bg-purple-800 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // Mock insights when no analytics data is available
  const mockInsights = [
    {
      id: '1',
      category: 'Entertainment',
      suggestion: 'Consider reducing entertainment expenses by 15% to save $180/month',
      potentialSavings: 180,
      priority: 'medium' as const
    },
    {
      id: '2',
      category: 'Grocery',
      suggestion: 'Great job! Your grocery spending is 20% below average',
      potentialSavings: 0,
      priority: 'low' as const
    },
    {
      id: '3',
      category: 'Bills',
      suggestion: 'Review your subscription services - potential savings of $45/month',
      potentialSavings: 45,
      priority: 'high' as const
    }
  ];

  const insights = analyticsData?.suggestions || mockInsights;

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'medium':
        return <TrendingUp size={16} className="text-yellow-500" />;
      case 'low':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Lightbulb size={16} className="text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Brain className="text-purple-600 dark:text-purple-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Financial Insights
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Personalized recommendations based on your spending patterns
            </p>
          </div>
        </div>
        <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
          {!analyticsData ? 'Demo Mode' : 'Live Data'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.slice(0, 3).map((insight) => (
          <div
            key={insight.id}
            className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}
          >
            <div className="flex items-start gap-3 mb-3">
              {getPriorityIcon(insight.priority)}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                  {insight.category}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {insight.suggestion}
                </p>
              </div>
            </div>
            
            {insight.potentialSavings > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Potential Savings
                </span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  ${insight.potentialSavings}/mo
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {!analyticsData && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> Connect to the Python analytics backend to get real AI-powered insights based on your actual spending data.
          </p>
        </div>
      )}
    </div>
  );
};