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
  needsRoleSelection: boolean;
  completeRoleSelection: (role: "customer" | "business" | "delivery") => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  needsRoleSelection: false,
  completeRoleSelection: async () => { /* placeholder */ }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);

  // Function to complete role selection process
  const completeRoleSelection = async (role: "customer" | "business" | "delivery") => {
    if (!user || !user.uid) return;
    
    try {
      // Update user document with selected role
      await setDoc(doc(db, "users", user.uid), {
        role,
        pendingRoleSelection: false
      }, { merge: true });
      
      // Update local user state
      setUser(prev => prev ? { ...prev, role, pendingRoleSelection: false } : null);
      setNeedsRoleSelection(false);
      
      // Clear pending flag from localStorage
      localStorage.removeItem("pendingRoleSelection");
    } catch (error) {
      console.error("Error completing role selection:", error);
    }
  };

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
          // First time social login - need to collect role information
          // We'll set a temporary user state that needs role selection
          localStorage.setItem("pendingRoleSelection", user.uid);
          
          // Keep temporary basic user data
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            pendingRoleSelection: true, // Mark as pending
            createdAt: serverTimestamp()
          });
          
          // User state will be updated by onAuthStateChanged handler
          // The pendingRoleSelection flag will be used to show role selection UI
        }
        // If user exists already, onAuthStateChanged handler will set the user state
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
          
          // Check for pending role selection
          const pendingUid = localStorage.getItem("pendingRoleSelection");
          const needsToSelectRole = pendingUid === firebaseUser.uid || 
            (userData && userData.pendingRoleSelection === true);
          
          setNeedsRoleSelection(needsToSelectRole ? true : false);
          
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
        setNeedsRoleSelection(false);
        // Clean up localStorage
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
