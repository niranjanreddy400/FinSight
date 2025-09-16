import { useState, useEffect } from 'react';
import { 
  collection, 
  doc,
  setDoc,
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { Budget, ExpenseCategory } from '../types';

export const useBudget = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBudgets([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'budgets'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const budgetsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Budget[];
      
      setBudgets(budgetsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const setBudget = async (month: string, totalBudget: number, categoryBudgets: Record<ExpenseCategory, number>) => {
    if (!user) return;

    try {
      const budgetId = `${user.uid}_${month}`;
      const budgetRef = doc(db, 'budgets', budgetId);
      
      await setDoc(budgetRef, {
        id: budgetId,
        userId: user.uid,
        month,
        totalBudget,
        categoryBudgets,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error setting budget:', error);
      throw error;
    }
  };

  const getCurrentMonthBudget = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return budgets.find(budget => budget.month === currentMonth);
  };

  return {
    budgets,
    loading,
    setBudget,
    getCurrentMonthBudget
  };
};