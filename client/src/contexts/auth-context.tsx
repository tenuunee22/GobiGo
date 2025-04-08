import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged, getUserData, db } from "@/lib/firebase";
import { getRedirectResult } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  role?: "customer" | "business" | "delivery";
  name?: string;
  [key: string]: any;
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  needsRoleSelection: boolean;
  completeRoleSelection: (role: "customer" | "business" | "delivery") => Promise<void>;
}
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  needsRoleSelection: false,
});
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const completeRoleSelection = async (role: "customer" | "business" | "delivery") => {
    if (!user || !user.uid) return;
    try {
      await setDoc(doc(db, "users", user.uid), {
        role,
        pendingRoleSelection: false
      }, { merge: true });
      setUser(prev => prev ? { ...prev, role, pendingRoleSelection: false } : null);
      setNeedsRoleSelection(false);
      localStorage.removeItem("pendingRoleSelection");
    } catch (error) {
      console.error("Error completing role selection:", error);
    }
  };
  const handleAuthRedirect = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        const user = result.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          localStorage.setItem("pendingRoleSelection", user.uid);
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            pendingRoleSelection: true,
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error("Error handling redirect:", error);
    }
  };
  useEffect(() => {
    handleAuthRedirect();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any) => {
      if (firebaseUser) {
        try {
          const userData = await getUserData(firebaseUser.uid);
          const pendingUid = localStorage.getItem("pendingRoleSelection");
          const needsToSelectRole = pendingUid === firebaseUser.uid || 
            (userData && userData.pendingRoleSelection === true);
          setNeedsRoleSelection(needsToSelectRole ? true : false);
          if (userData) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              ...userData,
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
        setNeedsRoleSelection(false);
        localStorage.removeItem("pendingRoleSelection");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        setUser, 
        needsRoleSelection,
        completeRoleSelection
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export function useAuth() {
  return useContext(AuthContext);
}
