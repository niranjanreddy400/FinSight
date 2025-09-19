@@ .. @@
 import { ref, push, set, remove, onValue, off } from 'firebase/database';
 import { database } from '../config/firebase';
 import { Transaction, TransactionInput } from '../types';
-import { useAuth } from './useAuth';
+import { useAuth } from './useAuth';
+
+// Demo transactions for testing
+const DEMO_TRANSACTIONS: Transaction[] = [
+  {
+    id: 'demo-1',
+    type: 'income',
+    category: 'Salary',
+    amount: 5000,
+    currency: 'USD',
+    date: new Date().toISOString().split('T')[0],
+    notes: 'Monthly salary',
+    createdAt: new Date().toISOString(),
+    updatedAt: new Date().toISOString(),
+    tags: ['work', 'monthly']
+  },
+  {
+    id: 'demo-2',
+    type: 'expense',
+    category: 'Rent',
+    amount: 1200,
+    currency: 'USD',
+    date: new Date().toISOString().split('T')[0],
+    notes: 'Monthly rent payment',
+    createdAt: new Date().toISOString(),
+    updatedAt: new Date().toISOString(),
+    tags: ['housing', 'monthly']
+  },
+  {
+    id: 'demo-3',
+    type: 'expense',
+    category: 'Grocery',
+    amount: 350,
+    currency: 'USD',
+    date: new Date().toISOString().split('T')[0],
+    notes: 'Weekly groceries',
+    createdAt: new Date().toISOString(),
+    updatedAt: new Date().toISOString(),
+    tags: ['food', 'weekly']
+  },
+  {
+    id: 'demo-4',
+    type: 'expense',
+    category: 'Entertainment',
+    amount: 80,
+    currency: 'USD',
+    date: new Date().toISOString().split('T')[0],
+    notes: 'Movie tickets and dinner',
+    createdAt: new Date().toISOString(),
+    updatedAt: new Date().toISOString(),
+    tags: ['leisure', 'weekend']
+  },
+  {
+    id: 'demo-5',
+    type: 'expense',
+    category: 'Transport',
+    amount: 120,
+    currency: 'USD',
+    date: new Date().toISOString().split('T')[0],
+    notes: 'Gas and parking',
+    createdAt: new Date().toISOString(),
+    updatedAt: new Date().toISOString(),
+    tags: ['car', 'fuel']
+  }
+];
 
 export const useTransactions = () => {
-  const { user } = useAuth();
+  const { user, isDemoMode } = useAuth();
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   const [loading, setLoading] = useState(true);
   const [offlineQueue, setOfflineQueue] = useState<TransactionInput[]>([]);
@@ .. @@
   useEffect(() => {
     if (!user) {
       setTransactions([]);
       setLoading(false);
       return;
     }
 
+    // Use demo data in demo mode
+    if (isDemoMode) {
+      setTransactions(DEMO_TRANSACTIONS);
+      setLoading(false);
+      return;
+    }
+
     const transactionsRef = ref(database, `users/${user.uid}/transactions`);
     
     const handleData = (snapshot: any) => {
@@ .. @@
   }, [user]);
 
   const addTransaction = async (transaction: TransactionInput) => {
     if (!user) return;
 
+    // In demo mode, just add to local state
+    if (isDemoMode) {
+      const newTransaction: Transaction = {
+        ...transaction,
+        id: `demo-${Date.now()}`,
+        createdAt: new Date().toISOString(),
+        updatedAt: new Date().toISOString()
+      };
+      setTransactions(prev => [newTransaction, ...prev]);
+      return;
+    }
+
     const newTransaction = {
       ...transaction,
       createdAt: new Date().toISOString(),
@@ .. @@
   const updateTransaction = async (id: string, updates: Partial<TransactionInput>) => {
     if (!user) return;
 
+    // In demo mode, update local state
+    if (isDemoMode) {
+      setTransactions(prev => 
+        prev.map(t => 
+          t.id === id 
+            ? { ...t, ...updates, updatedAt: new Date().toISOString() }
+            : t
+        )
+      );
+      return;
+    }
+
     try {
       const transactionRef = ref(database, `users/${user.uid}/transactions/${id}`);
       await set(transactionRef, {
@@ .. @@
   const deleteTransaction = async (id: string) => {
     if (!user) return;
 
+    // In demo mode, remove from local state
+    if (isDemoMode) {
+      setTransactions(prev => prev.filter(t => t.id !== id));
+      return;
+    }
+
     try {
       const transactionRef = ref(database, `users/${user.uid}/transactions/${id}`);
       await remove(transactionRef);
@@ .. @@
   };
 
   const syncOfflineTransactions = async () => {
-    if (!user || offlineQueue.length === 0) return;
+    if (!user || offlineQueue.length === 0 || isDemoMode) return;
 
     try {
       for (const transaction of offlineQueue) {