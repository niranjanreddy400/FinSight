import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { X, DollarSign } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { TransactionCategory } from '../../types';

interface TransactionFormData {
  amount: number;
  category: TransactionCategory;
  type: 'income' | 'expense';
  date: string;
  notes: string;
}

interface TransactionFormProps {
  onClose: () => void;
  initialData?: Partial<TransactionFormData>;
}

export const TransactionForm = ({ onClose, initialData }: TransactionFormProps) => {
  const { addTransaction } = useTransactions();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<TransactionFormData>({
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'expense',
      ...initialData
    }
  });

  const watchedType = watch('type');

  const expenseCategories: TransactionCategory[] = [
    'Rent', 'Grocery', 'EMI', 'Bills', 'Entertainment', 
    'Travel', 'Miscellaneous', 'Savings'
  ];

  const incomeCategories: TransactionCategory[] = [
    'Salary', 'Freelance', 'Investment Returns', 'Mutual Funds', 'Other Income'
  ];

  const categories = watchedType === 'income' ? incomeCategories : expenseCategories;

  const onSubmit = async (data: TransactionFormData) => {
    setLoading(true);
    try {
      await addTransaction(data);
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <DollarSign size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add Transaction
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="expense"
                  {...register('type', { required: 'Transaction type is required' })}
                  className="sr-only"
                />
                <div className={`w-full p-3 border-2 rounded-lg text-center cursor-pointer transition-colors ${
                  watchedType === 'expense'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-red-300'
                }`}>
                  <span className="font-medium">Expense</span>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="income"
                  {...register('type', { required: 'Transaction type is required' })}
                  className="sr-only"
                />
                <div className={`w-full p-3 border-2 rounded-lg text-center cursor-pointer transition-colors ${
                  watchedType === 'income'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-green-300'
                }`}>
                  <span className="font-medium">Income</span>
                </div>
              </label>
            </div>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { 
                required: 'Amount is required', 
                min: { value: 0.01, message: 'Amount must be greater than 0' }
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Add a note about this transaction..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                watchedType === 'income'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              } disabled:opacity-50`}
            >
              {loading ? 'Adding...' : `Add ${watchedType === 'income' ? 'Income' : 'Expense'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};