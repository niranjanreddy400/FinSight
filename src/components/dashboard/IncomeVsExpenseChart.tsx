import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Transaction } from '../../types';

interface IncomeVsExpenseChartProps {
  transactions: Transaction[];
}

export const IncomeVsExpenseChart = ({ transactions }: IncomeVsExpenseChartProps) => {
  const generateMonthlyData = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const monthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({
        month: format(monthDate, 'MMM yyyy'),
        income,
        expenses,
        savings: income - expenses
      });
    }
    return months;
  };

  const data = generateMonthlyData();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Income vs Expenses
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Last 6 Months
        </span>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="month"
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `$${value.toFixed(2)}`, 
                name.charAt(0).toUpperCase() + name.slice(1)
              ]}
              labelClassName="text-gray-900"
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Bar 
              dataKey="income" 
              fill="#10B981" 
              name="Income"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="expenses" 
              fill="#EF4444" 
              name="Expenses"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};