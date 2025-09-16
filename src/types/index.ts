export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: TransactionCategory;
  type: 'income' | 'expense';
  date: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionCategory = 
  | 'Rent'
  | 'Grocery'
  | 'EMI'
  | 'Mutual Funds'
  | 'Bills'
  | 'Entertainment'
  | 'Travel'
  | 'Miscellaneous'
  | 'Savings'
  | 'Salary'
  | 'Freelance'
  | 'Investment Returns'
  | 'Other Income';

export interface MonthlyStats {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  categoryBreakdown: Record<TransactionCategory, number>;
  monthOverMonth: { month: string; income: number; expenses: number; savings: number }[];
}

export interface AnalyticsData {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    savingsRate: number;
    topExpenseCategory: string;
    topIncomeSource: string;
  };
  suggestions: {
    id: string;
    category: string;
    suggestion: string;
    potentialSavings: number;
    priority: 'high' | 'medium' | 'low';
  }[];
  trends: {
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }[];
}

export interface Budget {
  id: string;
  userId: string;
  month: string;
  totalBudget: number;
  categoryBudgets: Record<TransactionCategory, number>;
  createdAt: string;
}