import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
        setHasCompletedOnboarding(false);
      }
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const loadProfile = async (uid) => {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const data = snap.data();
        setUserProfile(data);
        setHasCompletedOnboarding(!!data.onboardingComplete);
      }
    } catch (e) {
      console.error('loadProfile error:', e);
    }
  };

  const signUp = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', cred.user.uid), {
      email,
      createdAt: new Date().toISOString(),
      onboardingComplete: false,
    });
    return cred.user;
  };

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const logout = () => signOut(auth);

  const completeOnboarding = async (profileData) => {
    if (!user) return;
    const data = { ...profileData, onboardingComplete: true, updatedAt: new Date().toISOString() };
    await setDoc(doc(db, 'users', user.uid), data, { merge: true });
    setUserProfile(data);
    setHasCompletedOnboarding(true);
  };

  const updateProfile = async (data) => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid), data, { merge: true });
    setUserProfile(prev => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{
      user, userProfile, isLoading, hasCompletedOnboarding,
      signUp, login, logout, completeOnboarding, updateProfile, loadProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};