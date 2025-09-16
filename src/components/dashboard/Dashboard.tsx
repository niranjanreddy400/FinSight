import { useTransactions } from '../../hooks/useTransactions';
import { useAnalytics } from '../../hooks/useAnalytics';
import { StatsCards } from './StatsCards';
import { ExpenseChart } from './ExpenseChart';
import { IncomeVsExpenseChart } from './IncomeVsExpenseChart';
import { RecentTransactions } from './RecentTransactions';
import { MonthlyTrend } from './MonthlyTrend';
import { AIInsights } from './AIInsights';

export const Dashboard = () => {
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { analyticsData, loading: analyticsLoading } = useAnalytics();

  if (transactionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's your financial overview.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards transactions={transactions} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart transactions={transactions} />
        <IncomeVsExpenseChart transactions={transactions} />
      </div>

      {/* AI Insights */}
      <AIInsights analyticsData={analyticsData} loading={analyticsLoading} />

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyTrend transactions={transactions} />
        </div>
        <div className="lg:col-span-1">
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
};