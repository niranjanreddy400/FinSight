@@ .. @@
 import { auth } from '../config/firebase';
 import { User } from '../types';
 
+// Demo user for testing without authentication
+const DEMO_USER: User = {
+  uid: 'demo-user-123',
+  email: 'demo@finsight.app',
+  displayName: 'Demo User',
+  photoURL: null
+};
+
+// Demo credentials for testing
+export const DEMO_CREDENTIALS = {
+  email: 'demo@finsight.app',
+  password: 'demo123456'
+};
+
 export const useAuth = () => {
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);
+  const [isDemoMode, setIsDemoMode] = useState(false);
 
   useEffect(() => {
+    // Check if demo mode is enabled
+    const demoMode = localStorage.getItem('demo-mode') === 'true';
+    if (demoMode) {
+      setUser(DEMO_USER);
+      setIsDemoMode(true);
+      setLoading(false);
+      return;
+    }
+
     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
       if (firebaseUser) {
@@ .. @@
   }, []);
 
   const signIn = async (email: string, password: string) => {
+    // Check for demo credentials
+    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
+      localStorage.setItem('demo-mode', 'true');
+      setUser(DEMO_USER);
+      setIsDemoMode(true);
+      return;
+    }
+
     try {
       await signInWithEmailAndPassword(auth, email, password);
     } catch (error) {
@@ .. @@
   };
 
   const signOut = async () => {
+    if (isDemoMode) {
+      localStorage.removeItem('demo-mode');
+      setUser(null);
+      setIsDemoMode(false);
+      return;
+    }
+
     try {
       await firebaseSignOut(auth);
     } catch (error) {
@@ .. @@
   return {
     user,
     loading,
+    isDemoMode,
     signIn,
     signUp,
     signOut
   };
 };