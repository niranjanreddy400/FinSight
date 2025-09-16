import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { Transaction, TransactionCategory } from '../types';
import toast from 'react-hot-toast';

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      
      setTransactions(transactionsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const now = new Date().toISOString();
      await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        userId: user.uid,
        createdAt: now,
        updatedAt: now
      });
      toast.success('Transaction added successfully!');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
      throw error;
    }
  };

  const updateTransaction = async (id: string, transactionData: Partial<Transaction>) => {
    try {
      const transactionRef = doc(db, 'transactions', id);
      await updateDoc(transactionRef, {
        ...transactionData,
        updatedAt: new Date().toISOString()
      });
      toast.success('Transaction updated successfully!');
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
      toast.success('Transaction deleted successfully!');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
      throw error;
    }
  };

  const getTransactionsByDateRange = (startDate: string, endDate: string) => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return transactionDate >= start && transactionDate <= end;
    });
  };

  const getTransactionsByCategory = (category: TransactionCategory) => {
    return transactions.filter(transaction => transaction.category === category);
  };

  const getTransactionsByType = (type: 'income' | 'expense') => {
    return transactions.filter(transaction => transaction.type === type);
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByDateRange,
    getTransactionsByCategory,
    getTransactionsByType
  };
};