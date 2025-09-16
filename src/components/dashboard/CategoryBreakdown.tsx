import { startOfMonth, endOfMonth } from 'date-fns';
import { Expense, ExpenseCategory } from '../../types';

interface CategoryBreakdownProps {
  expenses: Expense[];
}

export const CategoryBreakdown = ({ expenses }: CategoryBreakdownProps) => {
  const now = new Date();
  const currentMonth = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);

  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= currentMonth && expenseDate <= currentMonthEnd;
  });

  const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  if (sortedCategories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Categories
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          No expenses this month
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Top Categories
      </h3>
      <div className="space-y-4">
        {sortedCategories.map(([category, amount], index) => {
          const percentage = (amount / totalAmount) * 100;
          return (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {category}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${
                    index === 0 ? 'from-blue-500 to-blue-600' :
                    index === 1 ? 'from-green-500 to-green-600' :
                    index === 2 ? 'from-yellow-500 to-yellow-600' :
                    'from-purple-500 to-purple-600'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};