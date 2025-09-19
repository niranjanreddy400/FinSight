import { auth } from '../config/firebase';
import { User } from '../types';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';

// Demo user for testing without authentication
const DEMO_USER: User = {
  uid: 'demo-user-123',
  email: 'demo@finsight.app',
  displayName: 'Demo User',
  photoURL: null
};

// Demo credentials for testing
export const DEMO_CREDENTIALS = {
  email: 'demo@finsight.app',
  password: 'demo123456'
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if demo mode is enabled
    const demoMode = localStorage.getItem('demo-mode') === 'true';
    if (demoMode) {
      setUser(DEMO_USER);
      setIsDemoMode(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Check for demo credentials
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      localStorage.setItem('demo-mode', 'true');
      setUser(DEMO_USER);
      setIsDemoMode(true);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    if (isDemoMode) {
      localStorage.removeItem('demo-mode');
      setUser(null);
      setIsDemoMode(false);
      return;
    }

    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    loading,
    isDemoMode,
    signIn,
    signUp,
    signOut
  };
};