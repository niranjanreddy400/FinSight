import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Target, Plus, Edit } from 'lucide-react';
import { useBudget } from '../../hooks/useBudget';
import { useExpenses } from '../../hooks/useExpenses';
import { ExpenseCategory } from '../../types';

interface BudgetFormData {
  totalBudget: number;
  categoryBudgets: Record<ExpenseCategory, number>;
}

export const BudgetManager = () => {
  const { getCurrentMonthBudget, setBudget } = useBudget();
  const { expenses } = useExpenses();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentBudget = getCurrentMonthBudget();
  const currentMonth = format(new Date(), 'yyyy-MM');

  const categories: ExpenseCategory[] = [
    'Rent', 'Grocery', 'EMI', 'Utilities', 'Transport', 
    'Entertainment', 'Healthcare', 'Savings/Investments', 'Misc'
  ];

  const { register, handleSubmit, watch, setValue } = useForm<BudgetFormData>({
    defaultValues: {
      totalBudget: currentBudget?.totalBudget || 0,
      categoryBudgets: currentBudget?.categoryBudgets || categories.reduce((acc, cat) => ({
        ...acc,
        [cat]: 0
      }), {} as Record<ExpenseCategory, number>)
    }
  });

  const watchedCategoryBudgets = watch('categoryBudgets');

  // Auto-calculate total budget based on category budgets
  const calculateTotalFromCategories = () => {
    const total = Object.values(watchedCategoryBudgets).reduce((sum, amount) => sum + (amount || 0), 0);
    setValue('totalBudget', total);
  };

  const onSubmit = async (data: BudgetFormData) => {
    setLoading(true);
    try {
      await setBudget(currentMonth, data.totalBudget, data.categoryBudgets);
      setShowForm(false);
    } catch (error) {
      console.error('Error setting budget:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get current month expenses for progress calculation
  const currentMonthExpenses = expenses.filter(expense => {
    return expense.date.startsWith(currentMonth);
  });

  const categorySpent = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Budget Management
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {currentBudget ? <Edit size={18} /> : <Plus size={18} />}
          {currentBudget ? 'Edit Budget' : 'Set Budget'}
        </button>
      </div>

      {!currentBudget && !showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <Target className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Budget Set
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Set a monthly budget to track your spending goals
          </p>
        </div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Budget for {format(new Date(), 'MMMM yyyy')}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Monthly Budget ($)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('totalBudget', { required: true, min: 0 })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Category Budgets
                </h3>
                <button
                  type="button"
                  onClick={calculateTotalFromCategories}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Auto-calculate total
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div key={category}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {category}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`categoryBudgets.${category}`, { min: 0 })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Saving...' : 'Save Budget'}
              </button>
            </div>
          </form>
        </div>
      )}

      {currentBudget && !showForm && (
        <div className="space-y-4">
          {categories.map((category) => {
            const budgetAmount = currentBudget.categoryBudgets[category] || 0;
            const spentAmount = categorySpent[category] || 0;
            const progress = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;

            if (budgetAmount === 0) return null;

            return (
              <div
                key={category}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {category}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ${spentAmount.toFixed(2)} / ${budgetAmount.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progress >= 100 ? 'bg-red-500' :
                      progress >= 80 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>{progress.toFixed(1)}% used</span>
                  <span className={
                    budgetAmount - spentAmount >= 0 ? 'text-green-600' : 'text-red-600'
                  }>
                    {budgetAmount - spentAmount >= 0 
                      ? `$${(budgetAmount - spentAmount).toFixed(2)} left`
                      : `$${(spentAmount - budgetAmount).toFixed(2)} over`
                    }
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};