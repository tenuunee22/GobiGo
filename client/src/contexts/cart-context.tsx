import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Cart item type
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  businessId?: string; // Which business this item belongs to
  businessName?: string; // Name of the business
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  // Add item to cart
  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      // Check if the item already exists in the cart
      const existingItem = prevItems.find(i => i.id === item.id);
      
      if (existingItem) {
        // If it exists, update the quantity
        return prevItems.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      } else {
        // Otherwise, add the new item
        return [...prevItems, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  // Calculate subtotal
  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate delivery fee
  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    // Free delivery for orders over 50,000₮
    if (subtotal >= 50000) return 0;
    // Base delivery fee
    return 2490;
  };

  // Calculate total
  const getTotal = () => {
    return getSubtotal() + getDeliveryFee();
  };

  // Get total number of items
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotal,
      getSubtotal,
      getDeliveryFee,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}