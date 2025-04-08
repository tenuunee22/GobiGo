import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  connectAuthEmulator
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
  connectFirestoreEmulator
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.appspot.com`,
  messagingSenderId: "307246836509", // Default value, can be replaced with actual value if available
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id"
};

// Initialize Firebase
let app;
try {
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

// Initialize services
const auth = getAuth();
const db = getFirestore();

// Connect to Firebase Emulators when in development
const useEmulator = import.meta.env.DEV || true; // Always use emulator for now
if (useEmulator) {
  try {
    console.log("Using Firebase Auth Emulator");
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    // For Firestore, add this line if you set up Firestore emulator too
    // connectFirestoreEmulator(db, "localhost", 8080);
  } catch (error) {
    console.error("Error connecting to Firebase Emulator:", error);
  }
}

const googleProvider = new GoogleAuthProvider();
let recaptchaVerifier: RecaptchaVerifier | null = null;

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
    // Get business information to determine order flow
    const businessDoc = await getDoc(doc(db, "users", orderData.businessId));
    if (!businessDoc.exists()) {
      throw new Error("Business not found");
    }
    
    const businessData = businessDoc.data();
    const businessType = businessData.businessType || "restaurant";
    
    // Set preparation needs based on business type
    // Restaurant orders need preparation by the business
    // Grocery, pharmacy, etc. are shopped by driver
    const needsPreparation = businessType === "restaurant";
    
    const ordersRef = collection(db, "orders");
    const newOrder = await addDoc(ordersRef, {
      ...orderData,
      businessType,
      needsPreparation,
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
    
    // Get orders that need pickup for both preparation types:
    // 1. For restaurant orders (needsPreparation=true): status is "ready" and no driver assigned
    // 2. For grocery/pharmacy (needsPreparation=false): status is "new" or "accepted" and no driver assigned
    const restaurantOrders = query(
      ordersRef, 
      where("needsPreparation", "==", true),
      where("status", "==", "ready"),
      where("driverId", "==", null)
    );
    
    const otherOrders = query(
      ordersRef,
      where("needsPreparation", "==", false),
      where("status", "in", ["new", "accepted"]),
      where("driverId", "==", null)
    );
    
    // Execute both queries
    const [restaurantSnapshot, otherSnapshot] = await Promise.all([
      getDocs(restaurantOrders),
      getDocs(otherOrders)
    ]);
    
    const orders: any[] = [];
    
    // Process restaurant orders (ready for pickup)
    restaurantSnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    // Process other orders (need shopping/collection by driver)
    otherSnapshot.forEach((doc) => {
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

export const updateOrderStatus = async (orderId: string, status: string, additionalData: any = {}) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    
    // First get the order to check business type and preparation needs
    const orderDoc = await getDoc(orderRef);
    if (!orderDoc.exists()) {
      throw new Error("Order not found");
    }
    
    const orderData = orderDoc.data();
    const needsPreparation = orderData.needsPreparation === undefined ? 
      (orderData.businessType === "restaurant") : orderData.needsPreparation;
    
    // Custom status flow based on business type
    let updatedStatus = status;
    
    // If order is being accepted by a driver
    if (status === "accepted") {
      if (!needsPreparation && additionalData.driverId) {
        // For grocery/pharmacy orders, driver needs to shop for items
        updatedStatus = "shopping"; // Driver is shopping for items
      }
    }
    // If order is marked as ready and it's a restaurant order
    else if (status === "ready" && needsPreparation) {
      // It's ready for pickup by driver
      updatedStatus = "ready_for_pickup";
    }
    // If order is completed by shopper/driver for grocery/pharmacy
    else if (status === "ready" && !needsPreparation) {
      // Items have been collected, ready for delivery
      updatedStatus = "items_collected";
    }
    
    // Update the order
    await updateDoc(orderRef, {
      status: updatedStatus,
      updatedAt: serverTimestamp(),
      ...additionalData
    });
    
    // If order is completed, update completedAt timestamp
    if (status === "completed") {
      await updateDoc(orderRef, {
        completedAt: serverTimestamp()
      });
    }
    
    return { ...orderData, status: updatedStatus, ...additionalData };
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

// Phone login functions
export const setupRecaptcha = (containerId: string) => {
  try {
    if (!recaptchaVerifier) {
      recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'normal',
        callback: () => {
          console.log('Captcha solved!');
        },
        'expired-callback': () => {
          console.log('Captcha expired!');
        }
      });
    }
    return recaptchaVerifier;
  } catch (error) {
    console.error("Error setting up recaptcha:", error);
    throw error;
  }
};

export const sendPhoneVerificationCode = async (phoneNumber: string, recaptchaContainerId: string) => {
  try {
    const verifier = setupRecaptcha(recaptchaContainerId);
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    return confirmationResult;
  } catch (error) {
    console.error("Error sending verification code:", error);
    throw error;
  }
};

export const verifyPhoneCode = async (confirmationResult: any, code: string) => {
  try {
    const userCredential = await confirmationResult.confirm(code);
    const user = userCredential.user;
    
    // Check if user data exists
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      // User is logging in for the first time
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        role: "customer", // Default role
        createdAt: serverTimestamp()
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error verifying code:", error);
    throw error;
  }
};

export { 
  app, 
  auth, 
  db, 
  onAuthStateChanged,
  recaptchaVerifier
};
