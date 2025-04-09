import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier
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
  serverTimestamp
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "307246836509", 
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error: any) {
  if (error.code === 'app/duplicate-app') {
    console.warn("Firebase app already exists, using the existing one");
  } else {
    console.error("Firebase initialization error", error);
    throw error;
  }
}
const auth = getAuth();
const db = getFirestore();
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');
let recaptchaVerifier: RecaptchaVerifier | null = null;
export const registerUser = async (email: string, password: string, userData: any) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (userData.name) {
      await updateProfile(user, {
        displayName: userData.name
      });
    }
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
    await signInWithRedirect(auth, googleProvider);
    return null;
  } catch (error) {
    console.error("Error logging in with Google:", error);
    throw error;
  }
};
export const loginWithFacebook = async () => {
  try {
    await signInWithRedirect(auth, facebookProvider);
    return null;
  } catch (error) {
    console.error("Error logging in with Facebook:", error);
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
export const createOrder = async (orderData: any) => {
  try {
    const businessDoc = await getDoc(doc(db, "users", orderData.businessId));
    if (!businessDoc.exists()) {
      throw new Error("Business not found");
    }
    const businessData = businessDoc.data();
    const businessType = businessData.businessType || "restaurant";
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
    const [restaurantSnapshot, otherSnapshot] = await Promise.all([
      getDocs(restaurantOrders),
      getDocs(otherOrders)
    ]);
    const orders: any[] = [];
    restaurantSnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
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
    const orderDoc = await getDoc(orderRef);
    if (!orderDoc.exists()) {
      throw new Error("Order not found");
    }
    const orderData = orderDoc.data();
    const needsPreparation = orderData.needsPreparation === undefined ? 
      (orderData.businessType === "restaurant") : orderData.needsPreparation;
    let updatedStatus = status;
    if (status === "accepted") {
      if (!needsPreparation && additionalData.driverId) {
        updatedStatus = "shopping"; 
      }
    }
    else if (status === "ready" && needsPreparation) {
      updatedStatus = "ready_for_pickup";
    }
    else if (status === "ready" && !needsPreparation) {
      updatedStatus = "items_collected";
    }
    await updateDoc(orderRef, {
      status: updatedStatus,
      updatedAt: serverTimestamp(),
      ...additionalData
    });
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
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        role: "customer", 
        createdAt: serverTimestamp()
      });
    }
    return user;
  } catch (error) {
    console.error("Error verifying code:", error);
    throw error;
  }
};
export const updateBusinessLocation = async (uid: string, location: { lat: number; lng: number; address: string }) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { 
      location,
      updatedAt: serverTimestamp() 
    });
    return true;
  } catch (error) {
    console.error("Error updating business location:", error);
    throw error;
  }
};
const storage = getStorage(app);
export const uploadFile = async (uid: string, file: File, path: string): Promise<string> => {
  try {
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${uid}/${path}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
export const updateBusinessProfile = async (uid: string, profileData: any) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating business profile:", error);
    throw error;
  }
};
export const updateUserProfile = async (uid: string, profileData: any) => {
  try {
    const userRef = doc(db, "users", uid);
    if (profileData.name && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: profileData.name
      });
    }
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
export const changeUserPassword = async (currentPassword: string, newPassword: string) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("No user logged in or user email is not available");
    }
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    return true;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};
export const handleAuthRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      let provider = "unknown";
      if (result.providerId) {
        provider = result.providerId;
      } else if (GoogleAuthProvider.credentialFromResult(result)) {
        provider = "google.com";
      } else if (FacebookAuthProvider.credentialFromResult(result)) {
        provider = "facebook.com";
      }
      const tokenResponse = (result as any)._tokenResponse;
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          photoURL: result.user.photoURL,
          authProvider: provider,
          role: "customer", 
          createdAt: serverTimestamp()
        });
      }
      return result.user;
    }
    return null;
  } catch (error) {
    console.error("Error handling auth redirect:", error);
    throw error;
  }
};
export { 
  app, 
  auth, 
  db, 
  storage,
  onAuthStateChanged,
  recaptchaVerifier,
  googleProvider,
  facebookProvider
};
