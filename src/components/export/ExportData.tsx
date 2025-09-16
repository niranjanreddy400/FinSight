import { useState } from 'react';
import { format } from 'date-fns';
import { Download, FileText, Table } from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';
import { useBudget } from '../../hooks/useBudget';

export const ExportData = () => {
  const { expenses } = useExpenses();
  const { budgets } = useBudget();
  const [loading, setLoading] = useState(false);

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          typeof row[header] === 'string' && row[header].includes(',') 
            ? `"${row[header]}"` 
            : row[header]
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExpenses = async () => {
    setLoading(true);
    try {
      const exportData = expenses.map(expense => ({
        Date: format(new Date(expense.date), 'yyyy-MM-dd'),
        Description: expense.description,
        Category: expense.category,
        Amount: expense.amount,
        'Created At': format(new Date(expense.createdAt), 'yyyy-MM-dd HH:mm:ss')
      }));

      exportToCSV(exportData, `expenses-${format(new Date(), 'yyyy-MM-dd')}`);
    } catch (error) {
      console.error('Error exporting expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportBudgets = async () => {
    setLoading(true);
    try {
      const exportData = budgets.map(budget => ({
        Month: budget.month,
        'Total Budget': budget.totalBudget,
        'Rent Budget': budget.categoryBudgets.Rent || 0,
        'Grocery Budget': budget.categoryBudgets.Grocery || 0,
        'EMI Budget': budget.categoryBudgets.EMI || 0,
        'Utilities Budget': budget.categoryBudgets.Utilities || 0,
        'Transport Budget': budget.categoryBudgets.Transport || 0,
        'Entertainment Budget': budget.categoryBudgets.Entertainment || 0,
        'Healthcare Budget': budget.categoryBudgets.Healthcare || 0,
        'Savings/Investments Budget': budget.categoryBudgets['Savings/Investments'] || 0,
        'Misc Budget': budget.categoryBudgets.Misc || 0,
        'Created At': format(new Date(budget.createdAt), 'yyyy-MM-dd HH:mm:ss')
      }));

      exportToCSV(exportData, `budgets-${format(new Date(), 'yyyy-MM-dd')}`);
    } catch (error) {
      console.error('Error exporting budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSummaryReport = () => {
    const summary = expenses.reduce((acc, expense) => {
      const month = expense.date.slice(0, 7);
      if (!acc[month]) {
        acc[month] = { total: 0, categories: {} };
      }
      acc[month].total += expense.amount;
      acc[month].categories[expense.category] = 
        (acc[month].categories[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, { total: number; categories: Record<string, number> }>);

    const reportData = Object.entries(summary).map(([month, data]) => ({
      Month: month,
      'Total Spent': data.total,
      'Top Category': Object.entries(data.categories)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A',
      'Transaction Count': expenses.filter(e => e.date.startsWith(month)).length
    }));

    exportToCSV(reportData, `monthly-summary-${format(new Date(), 'yyyy-MM-dd')}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Export Data
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Table className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Expenses Data
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {expenses.length} records
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Export all your expense records with dates, categories, amounts, and descriptions.
          </p>
          <button
            onClick={handleExportExpenses}
            disabled={loading || expenses.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Download size={18} />
            Export Expenses
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <FileText className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Budget Data
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {budgets.length} records
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Export your monthly budgets and category-wise budget allocations.
          </p>
          <button
            onClick={handleExportBudgets}
            disabled={loading || budgets.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Download size={18} />
            Export Budgets
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <FileText className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Summary Report
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monthly overview
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Export a comprehensive monthly summary with totals and top categories.
          </p>
          <button
            onClick={generateSummaryReport}
            disabled={loading || expenses.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <Download size={18} />
            Generate Report
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Export Information
        </h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start gap-2">
            <span className="font-medium">Format:</span>
            <span>All exports are in CSV format, compatible with Excel, Google Sheets, and other spreadsheet applications.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">File Naming:</span>
            <span>Files are automatically named with the current date for easy organization.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Data Privacy:</span>
            <span>All exports happen locally in your browser. No data is sent to external servers.</span>
          </div>
        </div>
      </div>
    </div>
  );
};