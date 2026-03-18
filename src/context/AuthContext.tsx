'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Check if Firebase is configured
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (apiKey && apiKey !== 'demo-api-key') {
      setIsConfigured(true);
      
      // Dynamic import Firebase to avoid build errors
      import('../lib/firebase').then(({ auth, db }) => {
        import('firebase/auth').then(({ onAuthStateChanged }) => {
          const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: unknown) => {
            if (firebaseUser && typeof firebaseUser === 'object' && 'uid' in firebaseUser) {
              const fu = firebaseUser as { uid: string; email: string | null; displayName: string | null; photoURL: string | null };
              setUser({
                uid: fu.uid,
                email: fu.email,
                displayName: fu.displayName,
                photoURL: fu.photoURL,
              });
            } else {
              setUser(null);
            }
            setLoading(false);
          });
          return () => unsubscribe();
        });
      }).catch(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) throw new Error('Firebase not configured');
    const { auth } = await import('../lib/firebase');
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!isConfigured) throw new Error('Firebase not configured');
    const { auth, db } = await import('../lib/firebase');
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      email: result.user.email,
      displayName: name,
      photoURL: null,
      createdAt: serverTimestamp(),
      balance: 0,
      isAdmin: false,
    });
  };

  const signInWithGoogle = async () => {
    if (!isConfigured) throw new Error('Firebase not configured');
    const { auth } = await import('../lib/firebase');
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (!isConfigured) return;
    const { auth } = await import('../lib/firebase');
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, logout, isConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
