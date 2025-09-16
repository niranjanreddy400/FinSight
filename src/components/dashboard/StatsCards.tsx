import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, CreditCard, Target } from 'lucide-react';
import { Transaction } from '../../types';

interface StatsCardsProps {
  transactions: Transaction[];
}

export const StatsCards = ({ transactions }: StatsCardsProps) => {
  const now = new Date();
  const currentMonth = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  const lastMonth = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= currentMonth && transactionDate <= currentMonthEnd;
  });

  const lastMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= lastMonth && transactionDate <= lastMonthEnd;
  });

  const currentIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const lastIncome = lastMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const lastExpenses = lastMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = currentIncome - currentExpenses;
  const lastNetSavings = lastIncome - lastExpenses;

  const incomeChange = lastIncome > 0 ? ((currentIncome - lastIncome) / lastIncome) * 100 : 0;
  const expenseChange = lastExpenses > 0 ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 : 0;
  const savingsChange = lastNetSavings !== 0 ? ((netSavings - lastNetSavings) / Math.abs(lastNetSavings)) * 100 : 0;

  const stats = [
    {
      title: 'Total Income',
      value: `$${currentIncome.toFixed(2)}`,
      change: incomeChange,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Total Expenses',
      value: `$${currentExpenses.toFixed(2)}`,
      change: expenseChange,
      icon: CreditCard,
      color: 'red',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400'
    },
    {
      title: 'Net Savings',
      value: `$${netSavings.toFixed(2)}`,
      change: savingsChange,
      icon: PiggyBank,
      color: netSavings >= 0 ? 'blue' : 'orange',
      bgColor: netSavings >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20',
      textColor: netSavings >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Savings Rate',
      value: `${currentIncome > 0 ? ((netSavings / currentIncome) * 100).toFixed(1) : 0}%`,
      change: 0,
      icon: Target,
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;
        
        return (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon size={20} className={stat.textColor} />
              </div>
              {stat.change !== 0 && (
                <div className={`flex items-center gap-1 text-sm ${
                  isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{Math.abs(stat.change).toFixed(1)}%</span>
                </div>
              )}
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};