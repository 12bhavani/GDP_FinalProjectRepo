import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../../firebase/config';

type AuthContextType = {
  user: any;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  error: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const AUTH_KEY = 'AUTH_USER_V1';
  const ADMIN_KEY = 'HARDCODED_ADMIN_V1';

  useEffect(() => {
    let mounted = true;

    // Try restore saved state (either hardcoded admin or saved firebase user)
    (async () => {
      try {
        const adminFlag = await AsyncStorage.getItem(ADMIN_KEY);
        if (adminFlag === 'true') {
          if (!mounted) return;
          setUser({ isHardcodedAdmin: true });
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        const saved = await AsyncStorage.getItem(AUTH_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (!mounted) return;
          setUser(parsed);
        }
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setError(null);

        if (firebaseUser) {
          setUser(firebaseUser);
          // persist minimal user info for quick restore
          await AsyncStorage.setItem(
            AUTH_KEY,
            JSON.stringify({ uid: firebaseUser.uid, email: firebaseUser.email })
          );

          // Check if user is admin in Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsAdmin(userData.role === 'admin');
          } else {
            setIsAdmin(false);
            setError('User data not found');
          }
        } else {
          // signed out: clear persisted firebase user (but keep hardcoded admin flag untouched)
          setUser(null);
          setIsAdmin(false);
          await AsyncStorage.removeItem(AUTH_KEY);
        }
      } catch (err) {
        setError('Failed to fetch user data');
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
