'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, AVATARS, AVATAR_COLORS } from '../types';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createDefaultProfile = (uid: string, email: string | null, displayName: string | null): UserProfile => {
  const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
  const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  
  return {
    uid,
    displayName: displayName || email?.split('@')[0] || 'Collector',
    email: email || '',
    avatar: randomAvatar,
    avatarColor: randomColor,
    bio: '',
    tagline: '',
    location: '',
    website: '',
    joinedAt: new Date().toISOString(),
    postCount: 0,
    tradeCount: 0,
    lastActive: new Date().toISOString(),
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = true;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);

        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            const defaultProfile = createDefaultProfile(firebaseUser.uid, firebaseUser.email, firebaseUser.displayName);
            await setDoc(doc(db, 'users', firebaseUser.uid), defaultProfile);
            setProfile(defaultProfile);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          const defaultProfile = createDefaultProfile(firebaseUser.uid, firebaseUser.email, firebaseUser.displayName);
          setProfile(defaultProfile);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const defaultProfile = createDefaultProfile(result.user.uid, email, name);
    
    await setDoc(doc(db, 'users', result.user.uid), defaultProfile);
  };

  const signInWithGoogle = async () => {
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(auth, email);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;
    
    const updatedProfile = { ...profile, ...updates };
    await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });
    setProfile(updatedProfile);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      loading, 
      signIn, 
      signUp, 
      signInWithGoogle, 
      logout, 
      resetPassword,
      updateProfile,
      isConfigured 
    }}>
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
