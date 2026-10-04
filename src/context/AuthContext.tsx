import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logoutUser } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  activeUid: string;
  activeDisplayName: string;
  signInWithGoogle: () => Promise<void>;
  signInDemo: () => Promise<void>;
  signInAsAdmin: () => void;
  logout: () => Promise<void>;
}

const ADMIN_EMAIL = 'ahammam25101972@gmail.com';
const GUEST_STORAGE_KEY = 'athar_tayyib_user_profile';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getOrCreateLocalUser(): UserProfile {
  try {
    const saved = localStorage.getItem(GUEST_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // Ignore JSON parse error
  }

  const newProfile: UserProfile = {
    uid: 'guest_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    email: 'guest@athartayyib.local',
    displayName: 'فاعل خير',
    role: 'user',
    createdAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(newProfile));
  } catch (e) {}

  return newProfile;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(getOrCreateLocalUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        const isUserAdmin = currentUser.email === ADMIN_EMAIL;
        const profile: UserProfile = {
          uid: currentUser.uid,
          email: currentUser.email || 'user@athartayyib.org',
          displayName: currentUser.displayName || 'فاعل خير',
          role: isUserAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        };
        setUserProfile(profile);
        try {
          localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(profile));
          await setDoc(doc(db, 'users', currentUser.uid), profile, { merge: true });
        } catch (e) {
          console.warn('Could not sync user profile to firestore:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.warn('Google Sign In popup was closed or restricted:', err);
      // Fallback: continue with local profile
      alert('ملاحظة: يمكنك متابعة استخدام جميع ميزات المنصة كفاعل خير، أو استخدام حساب الإدارة.');
    }
  };

  const handleDemoSignIn = async () => {
    const demoProfile: UserProfile = {
      uid: 'demo_user_' + Math.random().toString(36).substring(2, 7),
      email: 'demo@athartayyib.org',
      displayName: 'فاعل خير',
      role: 'user',
      createdAt: new Date().toISOString()
    };
    setUserProfile(demoProfile);
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(demoProfile));
    } catch (e) {}
  };

  const handleSignInAsAdmin = () => {
    const adminProfile: UserProfile = {
      uid: 'admin_' + ADMIN_EMAIL.replace(/[^a-zA-Z0-9]/g, '_'),
      email: ADMIN_EMAIL,
      displayName: 'مدير المنصة (المشرف العام)',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    setUserProfile(adminProfile);
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(adminProfile));
    } catch (e) {}
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {}
    const newGuest = getOrCreateLocalUser();
    setUserProfile(newGuest);
  };

  const isAdmin = userProfile?.email === ADMIN_EMAIL || userProfile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user: firebaseUser,
        userProfile,
        isAdmin,
        loading,
        activeUid: userProfile.uid,
        activeDisplayName: userProfile.displayName,
        signInWithGoogle: handleGoogleSignIn,
        signInDemo: handleDemoSignIn,
        signInAsAdmin: handleSignInAsAdmin,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
