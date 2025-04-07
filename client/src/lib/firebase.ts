import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// User related functions
export const registerUser = async (email: string, password: string, userData: any) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add display name
    if (userData.name) {
      await updateProfile(user, {
        displayName: userData.name
      });
    }

    // Add user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: userData.name,
      role: userData.role || "customer",
      createdAt: serverTimestamp(),
      ...userData
    });

    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if the user document exists
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      // This is the user's first login, create a document with default role
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        role: "customer", // Default role
        createdAt: serverTimestamp()
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error logging in with Google:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const getUserData = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

// Business related functions
export const addProduct = async (businessId: string, productData: any) => {
  try {
    const productsRef = collection(db, "products");
    const newProduct = await addDoc(productsRef, {
      businessId,
      ...productData,
      createdAt: serverTimestamp()
    });
    return newProduct.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const getBusinessProducts = async (businessId: string) => {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("businessId", "==", businessId));
    const querySnapshot = await getDocs(q);
    
    const products: any[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    
    return products;
  } catch (error) {
    console.error("Error getting business products:", error);
    throw error;
  }
};

// Order related functions
export const createOrder = async (orderData: any) => {
  try {
    const ordersRef = collection(db, "orders");
    const newOrder = await addDoc(ordersRef, {
      ...orderData,
      status: "new",
      createdAt: serverTimestamp()
    });
    return newOrder.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getCustomerOrders = async (customerId: string) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("customerId", "==", customerId));
    const querySnapshot = await getDocs(q);
    
    const orders: any[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    console.error("Error getting customer orders:", error);
    throw error;
  }
};

export const getBusinessOrders = async (businessId: string) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("businessId", "==", businessId));
    const querySnapshot = await getDocs(q);
    
    const orders: any[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    console.error("Error getting business orders:", error);
    throw error;
  }
};

export const getAvailableOrders = async () => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("status", "==", "accepted"), where("driverId", "==", null));
    const querySnapshot = await getDocs(q);
    
    const orders: any[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    console.error("Error getting available orders:", error);
    throw error;
  }
};

export const getDriverOrders = async (driverId: string) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("driverId", "==", driverId));
    const querySnapshot = await getDocs(q);
    
    const orders: any[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    console.error("Error getting driver orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: string, additionalData = {}) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp(),
      ...additionalData
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Restaurant/Business listings
export const getBusinesses = async (category?: string) => {
  try {
    const usersRef = collection(db, "users");
    let q;
    
    if (category) {
      q = query(
        usersRef, 
        where("role", "==", "business"),
        where("businessType", "==", category)
      );
    } else {
      q = query(usersRef, where("role", "==", "business"));
    }
    
    const querySnapshot = await getDocs(q);
    
    const businesses: any[] = [];
    querySnapshot.forEach((doc) => {
      businesses.push({ id: doc.id, ...doc.data() });
    });
    
    return businesses;
  } catch (error) {
    console.error("Error getting businesses:", error);
    throw error;
  }
};

export { 
  app, 
  auth, 
  db, 
  onAuthStateChanged
};
