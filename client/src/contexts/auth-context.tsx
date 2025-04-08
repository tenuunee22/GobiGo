import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged, getUserData, db } from "@/lib/firebase";
import { getRedirectResult } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  role?: "customer" | "business" | "delivery"; // Хэрэглэгчийн төрөл
  name?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle auth redirects (for social login)
  const handleAuthRedirect = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        // User successfully signed in after redirect
        const user = result.user;
        
        // Check if we need to create a new user document in Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          // This is the user's first login with this social provider
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            role: "customer", // Default role
            createdAt: serverTimestamp()
          });
        }
        
        // We don't need to manually set the user state here
        // as the onAuthStateChanged handler will take care of it
      }
    } catch (error) {
      console.error("Error handling redirect:", error);
    }
  };

  useEffect(() => {
    // Check for redirect results when component mounts
    handleAuthRedirect();
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any) => {
      if (firebaseUser) {
        // User is signed in
        try {
          // Get additional user data from Firestore
          const userData = await getUserData(firebaseUser.uid);
          
          if (userData) {
            // Combine Firebase user and Firestore data
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              ...userData,
            });
          } else {
            // If no Firestore data yet, just use Firebase user data
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
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
