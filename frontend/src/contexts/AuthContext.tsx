import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  sessionTimeout: number;
  resetSessionTimeout: () => void;
  showSessionTimeoutModal: boolean;
  setShowSessionTimeoutModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30 * 60 * 1000); // 30 minutes in milliseconds
  const [showSessionTimeoutModal, setShowSessionTimeoutModal] = useState(false);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  // Session timeout functions
  const resetSessionTimeout = useCallback(() => {
    // Clear existing timeouts
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    if (currentUser) {
      // Set warning timeout (5 minutes before session expires)
      warningTimeoutRef.current = setTimeout(() => {
        setShowSessionTimeoutModal(true);
      }, sessionTimeout - (5 * 60 * 1000)); // 5 minutes warning

      // Set session timeout
      sessionTimeoutRef.current = setTimeout(() => {
        logout();
        setShowSessionTimeoutModal(false);
      }, sessionTimeout);
    }
  }, [currentUser, sessionTimeout, logout]);

  const handleUserActivity = useCallback(() => {
    if (currentUser) {
      resetSessionTimeout();
    }
  }, [currentUser, resetSessionTimeout]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setCurrentUser(user);
      setLoading(false);
      
      // Reset session timeout when user changes
      if (user) {
        resetSessionTimeout();
      } else {
        // Clear timeouts when user logs out
        if (sessionTimeoutRef.current) {
          clearTimeout(sessionTimeoutRef.current);
        }
        if (warningTimeoutRef.current) {
          clearTimeout(warningTimeoutRef.current);
        }
        setShowSessionTimeoutModal(false);
      }
    });

    return unsubscribe;
  }, [sessionTimeout]);

  // Set up activity listeners
  useEffect(() => {
    if (currentUser) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      events.forEach(event => {
        document.addEventListener(event, handleUserActivity, true);
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleUserActivity, true);
        });
      };
    }
  }, [currentUser]);

  const value = {
    currentUser,
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword,
    loading,
    sessionTimeout,
    resetSessionTimeout,
    showSessionTimeoutModal,
    setShowSessionTimeoutModal
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 