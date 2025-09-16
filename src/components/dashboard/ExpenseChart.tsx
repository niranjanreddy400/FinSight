import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { startOfMonth, endOfMonth } from 'date-fns';
import { Transaction, TransactionCategory } from '../../types';

interface ExpenseChartProps {
  transactions: Transaction[];
}

export const ExpenseChart = ({ transactions }: ExpenseChartProps) => {
  const now = new Date();
  const currentMonth = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);

  const currentMonthExpenses = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= currentMonth && 
           transactionDate <= currentMonthEnd && 
           transaction.type === 'expense';
  });

  const categoryTotals = currentMonthExpenses.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<TransactionCategory, number>);

  const chartData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: ((amount / Object.values(categoryTotals).reduce((sum, val) => sum + val, 0)) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value);

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
    '#EC4899', '#6366F1'
  ];

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Expense Breakdown
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <PieChart size={24} className="text-gray-400" />
            </div>
            <p>No expenses this month</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Expense Breakdown
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          This Month
        </span>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              label={({ percentage }) => `${percentage}%`}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};