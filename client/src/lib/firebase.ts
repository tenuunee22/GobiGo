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
  deleteDoc,
  serverTimestamp,
  writeBatch,
  limit,
  orderBy,
  startAfter,
  enableIndexedDbPersistence,
  onSnapshot
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
let app;
try {
  if (!import.meta.env.VITE_FIREBASE_API_KEY || 
      !import.meta.env.VITE_FIREBASE_PROJECT_ID || 
      !import.meta.env.VITE_FIREBASE_APP_ID) {
    throw new Error('Missing Firebase configuration. Please check your environment variables.');
  }
  
  app = initializeApp(firebaseConfig);
} catch (error: any) {
  if (error.code === 'app/duplicate-app') {
    // If app already exists, just use the current one
    console.warn("Firebase app already exists, using the existing one");
  } else {
    console.error("Firebase initialization error", error);
    throw error;
  }
}

const auth = getAuth();
const db = getFirestore();

// Disable offline data persistence for better multi-tab support
// This resolves the "failed-precondition" errors in development
const disablePersistence = true;
let persistenceEnabled = false;

if (!disablePersistence) {
  try {
    enableIndexedDbPersistence(db).then(() => {
      persistenceEnabled = true;
      console.log("Firebase persistence enabled successfully");
    }).catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn('Firebase persistence could not be enabled: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        // The current browser doesn't support persistence
        console.warn('Firebase persistence not supported by this browser');
      }
    });
  } catch (err) {
    console.warn('Error enabling persistence:', err);
  }
} else {
  console.info('Firebase persistence explicitly disabled for multi-tab support');
}

// Utility function to handle Firebase errors with better user feedback
export const handleFirebaseError = (error: any, fallbackMessage = "Хүсэлт гүйцэтгэхэд алдаа гарлаа") => {
  console.error("Firebase error:", error);
  
  // Map common Firebase error codes to user-friendly messages
  const errorMessages: {[key: string]: string} = {
    'auth/user-not-found': 'Имэйл хаяг эсвэл нууц үг буруу байна',
    'auth/wrong-password': 'Имэйл хаяг эсвэл нууц үг буруу байна',
    'auth/email-already-in-use': 'Энэ имэйл хаяг бүртгэлтэй байна',
    'auth/weak-password': 'Нууц үг хэтэрхий богино байна. 6-с дээш тэмдэгт оруулна уу.',
    'auth/invalid-email': 'Имэйл хаяг буруу байна',
    'auth/user-disabled': 'Энэ хэрэглэгчийн эрх хаагдсан байна',
    'auth/requires-recent-login': 'Энэ үйлдлийг гүйцэтгэхийн тулд дахин нэвтэрнэ үү',
    'auth/network-request-failed': 'Сүлжээний алдаа гарлаа. Интернэт холболтоо шалгана уу.',
    'permission-denied': 'Таны эрх хүрэхгүй байна',
    'failed-precondition': 'Үйлдлийг одоо гүйцэтгэх боломжгүй байна',
    'not-found': 'Хайсан өгөгдөл олдсонгүй'
  };
  
  // Extract the error code and find appropriate message
  const errorCode = error?.code || '';
  const userMessage = errorMessages[errorCode] || fallbackMessage;
  
  return {
    code: errorCode,
    message: userMessage,
    originalError: error
  };
}

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
    return { id: newProduct.id, ...productData };
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const updateProduct = async (productId: string, productData: any) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: serverTimestamp()
    });
    
    return { id: productId, ...productData };
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const getBusinessProducts = async (businessId: string) => {
  try {
    const productsRef = collection(db, "products");
    const q = query(
      productsRef, 
      where("businessId", "==", businessId),
      orderBy("createdAt", "desc")
    );
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

// Subscribe to real-time updates for business products
export const subscribeToBusinessProducts = (
  businessId: string, 
  callback: (products: any[]) => void
) => {
  try {
    const productsRef = collection(db, "products");
    const q = query(
      productsRef, 
      where("businessId", "==", businessId),
      orderBy("createdAt", "desc")
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const products: any[] = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      callback(products);
    }, (error) => {
      console.error("Error in products snapshot listener:", error);
    });
  } catch (error) {
    console.error("Error setting up products subscription:", error);
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
    const q = query(
      ordersRef, 
      where("customerId", "==", customerId),
      orderBy("createdAt", "desc")
    );
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

// Subscribe to real-time customer order updates
export const subscribeToCustomerOrders = (
  customerId: string,
  callback: (orders: any[]) => void
) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef, 
      where("customerId", "==", customerId),
      orderBy("createdAt", "desc")
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const orders: any[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      callback(orders);
    }, (error) => {
      console.error("Error in customer orders snapshot listener:", error);
    });
  } catch (error) {
    console.error("Error setting up customer orders subscription:", error);
    throw error;
  }
};

export const getBusinessOrders = async (businessId: string) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef, 
      where("businessId", "==", businessId),
      orderBy("createdAt", "desc")
    );
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

// Subscribe to real-time business order updates
export const subscribeToBusinessOrders = (
  businessId: string,
  callback: (orders: any[]) => void
) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef, 
      where("businessId", "==", businessId),
      orderBy("createdAt", "desc")
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const orders: any[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      callback(orders);
    }, (error) => {
      console.error("Error in business orders snapshot listener:", error);
    });
  } catch (error) {
    console.error("Error setting up business orders subscription:", error);
    throw error;
  }
};

export const getAvailableOrders = async () => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef, 
      where("status", "==", "accepted"), 
      where("driverId", "==", null),
      orderBy("createdAt", "desc")
    );
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

// Subscribe to real-time available order updates
export const subscribeToAvailableOrders = (
  callback: (orders: any[]) => void
) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef, 
      where("status", "==", "accepted"), 
      where("driverId", "==", null),
      orderBy("createdAt", "desc")
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const orders: any[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      callback(orders);
    }, (error) => {
      console.error("Error in available orders snapshot listener:", error);
    });
  } catch (error) {
    console.error("Error setting up available orders subscription:", error);
    throw error;
  }
};

export const getDriverOrders = async (driverId: string) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef, 
      where("driverId", "==", driverId),
      orderBy("createdAt", "desc")
    );
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

// Subscribe to real-time driver order updates
export const subscribeToDriverOrders = (
  driverId: string,
  callback: (orders: any[]) => void
) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef, 
      where("driverId", "==", driverId),
      orderBy("createdAt", "desc")
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const orders: any[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      callback(orders);
    }, (error) => {
      console.error("Error in driver orders snapshot listener:", error);
    });
  } catch (error) {
    console.error("Error setting up driver orders subscription:", error);
    throw error;
  }
};

interface OrderStatusUpdateData {
  status: string;
  updatedAt: any;
  driverId?: string;
  businessId?: string;
  businessName?: string;
  driverName?: string;
  availableForDrivers?: boolean;
  statusHistory?: Array<{
    status: string;
    timestamp: any;
    changedBy?: string | null;
    previousStatus?: string | null;
  }>;
  estimatedDeliveryTime?: Date;
  pickedUpTime?: Date;
  deliveredTime?: Date;
  completedTime?: Date;
  [key: string]: any; // Allow any other properties
}

export const updateOrderStatus = async (orderId: string, status: string, additionalData: Record<string, any> = {}) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    
    // First get the order to check its current data
    const orderDoc = await getDoc(orderRef);
    if (!orderDoc.exists()) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    
    // Get the current order data
    const orderData = orderDoc.data();
    
    // Prepare the update data
    const updateData: OrderStatusUpdateData = {
      status,
      updatedAt: serverTimestamp(),
      ...additionalData
    };
    
    // For status transitions, store the history
    if (!orderData.statusHistory) {
      updateData.statusHistory = [{
        status: orderData.status || 'placed',
        timestamp: serverTimestamp(),
        previousStatus: null
      }];
    } else {
      // Clone the existing history and add the new status
      const newHistory = [...orderData.statusHistory];
      newHistory.push({
        status: orderData.status,
        timestamp: serverTimestamp(),
        changedBy: additionalData.driverId || additionalData.businessId || null
      });
      updateData.statusHistory = newHistory;
    }
    
    // Update the order with new status and additional data
    await updateDoc(orderRef, updateData);
    
    // Return the updated order
    return {
      id: orderId,
      ...orderData,
      ...updateData,
      // Replace serverTimestamp placeholders with actual JS Date
      updatedAt: new Date()
    };
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

// Subscribe to real-time business listings updates
export const subscribeToBusinesses = (
  callback: (businesses: any[]) => void,
  category?: string
) => {
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
    
    return onSnapshot(q, (querySnapshot) => {
      const businesses: any[] = [];
      querySnapshot.forEach((doc) => {
        businesses.push({ id: doc.id, ...doc.data() });
      });
      callback(businesses);
    }, (error) => {
      console.error("Error in businesses snapshot listener:", error);
    });
  } catch (error) {
    console.error("Error setting up businesses subscription:", error);
    throw error;
  }
};

export { 
  app, 
  auth, 
  db, 
  onAuthStateChanged
};
