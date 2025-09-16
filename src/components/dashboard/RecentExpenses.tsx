import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { Expense } from '../../types';

interface RecentExpensesProps {
  expenses: Expense[];
}

export const RecentExpenses = ({ expenses }: RecentExpensesProps) => {
  const recentExpenses = expenses.slice(0, 5);

  if (recentExpenses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Expenses
        </h3>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No expenses recorded yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Expenses
      </h3>
      <div className="space-y-3">
        {recentExpenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {expense.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{expense.category}</span>
                    <span>•</span>
                    <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${expense.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Edit size={16} />
              </button>
              <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};