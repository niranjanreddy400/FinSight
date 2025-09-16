import { startOfMonth, endOfMonth } from 'date-fns';
import { Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { Expense, Budget } from '../../types';

interface BudgetProgressProps {
  expenses: Expense[];
  budget?: Budget;
}

export const BudgetProgress = ({ expenses, budget }: BudgetProgressProps) => {
  const now = new Date();
  const currentMonth = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);

  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= currentMonth && expenseDate <= currentMonthEnd;
  });

  const totalSpent = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (!budget) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Budget Progress
        </h3>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No budget set for this month
        </div>
      </div>
    );
  }

  const progress = (totalSpent / budget.totalBudget) * 100;
  const remaining = budget.totalBudget - totalSpent;

  const getProgressColor = () => {
    if (progress >= 100) return 'bg-red-500';
    if (progress >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = () => {
    if (progress >= 100) return AlertTriangle;
    if (progress >= 80) return AlertTriangle;
    return CheckCircle;
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <Target className="text-blue-600 dark:text-blue-400" size={20} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Budget Progress
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Spent</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ${totalSpent.toFixed(2)} / ${budget.totalBudget.toFixed(2)}
          </span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon
              size={16}
              className={`${
                progress >= 100 ? 'text-red-500' :
                progress >= 80 ? 'text-yellow-500' :
                'text-green-500'
              }`}
            />
            <span className="text-sm font-medium">
              {progress.toFixed(1)}% used
            </span>
          </div>
          <span className={`text-sm font-medium ${
            remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {remaining >= 0 ? `$${remaining.toFixed(2)} left` : `$${Math.abs(remaining).toFixed(2)} over`}
          </span>
        </div>
      </div>
    </div>
  );
};