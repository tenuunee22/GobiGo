import {
  users,
  products,
  orders,
  orderItems,
  type User,
  type Product,
  type Order,
  type OrderItem,
  type InsertUser,
  type InsertProduct,
  type InsertOrder,
  type InsertOrderItem,
  type RecipeRecommendation
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Product methods
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByBusiness(businessUid: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Order methods
  getOrder(id: number): Promise<Order | undefined>;
  getOrderWithItems(id: number): Promise<{ order: Order; items: OrderItem[] } | undefined>;
  getOrdersByCustomer(customerUid: string): Promise<Order[]>;
  getOrdersByBusiness(businessUid: string): Promise<Order[]>;
  getOrdersByDriver(driverUid: string): Promise<Order[]>;
  getAvailableOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string, driverId?: string): Promise<Order | undefined>;
  
  // Recipe recommendation methods
  getRecipeRecommendations(userId?: string, limit?: number): Promise<RecipeRecommendation[]>;
  getUserFavoriteRecipes(userId: string): Promise<RecipeRecommendation[]>;
  toggleFavoriteRecipe(userId: string, recipeId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem[]>;
  private favoriteRecipes: Map<string, Set<string>>;
  private currentUserId: number;
  private currentProductId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.favoriteRecipes = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.uid === uid,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const timestamp = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByBusiness(businessUid: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.businessId === businessUid
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const timestamp = new Date();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct: Product = {
      ...product,
      ...productData,
      updatedAt: new Date()
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderWithItems(id: number): Promise<{ order: Order; items: OrderItem[] } | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const items = this.orderItems.get(id) || [];
    return { order, items };
  }

  async getOrdersByCustomer(customerUid: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.customerId === customerUid
    );
  }

  async getOrdersByBusiness(businessUid: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.businessId === businessUid
    );
  }

  async getOrdersByDriver(driverUid: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.driverId === driverUid
    );
  }

  async getAvailableOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.status === 'accepted' && !order.driverId
    );
  }

  async createOrder(insertOrder: InsertOrder, insertItems: InsertOrderItem[]): Promise<Order> {
    const id = this.currentOrderId++;
    const timestamp = new Date();
    
    // Create the order
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
      completedAt: null
    };
    this.orders.set(id, order);
    
    // Create the order items
    const items: OrderItem[] = insertItems.map(item => {
      const itemId = this.currentOrderItemId++;
      return {
        ...item,
        id: itemId,
        orderId: id
      };
    });
    
    this.orderItems.set(id, items);
    return order;
  }

  async updateOrderStatus(id: number, status: string, driverId?: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = {
      ...order,
      status,
      updatedAt: new Date(),
      completedAt: ['delivered', 'declined', 'cancelled'].includes(status) ? new Date() : order.completedAt
    };
    
    // If driver is assigned
    if (driverId) {
      updatedOrder.driverId = driverId;
    }
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Recipe recommendation methods
  async getRecipeRecommendations(userId?: string, limit: number = 10): Promise<RecipeRecommendation[]> {
    // Demo recommendations - in a real app, this would pull from products and user preferences
    const mockRecommendations: RecipeRecommendation[] = [
      {
        id: '1',
        name: 'Ногоотой Хуушуур',
        imageUrl: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        restaurantName: 'Хүслэн Ресторан',
        restaurantLogoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
        rating: 4.8,
        price: 8000,
        deliveryTime: '20-30 мин',
        tags: ['Монгол хоол', 'Үндэсний хоол', 'Түргэн хоол'],
        isFavorite: userId ? this.favoriteRecipes.get(userId)?.has('1') || false : false
      },
      {
        id: '2',
        name: 'Өндөгтэй будаа',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        restaurantName: 'Garden Cafe',
        restaurantLogoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
        rating: 4.5,
        price: 9500,
        deliveryTime: '15-25 мин',
        tags: ['Солонгос хоол', 'Эрүүл хоол', 'Амттан'],
        isFavorite: userId ? this.favoriteRecipes.get(userId)?.has('2') || false : false
      },
      {
        id: '3',
        name: 'Том Бургер',
        imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        restaurantName: 'Big Burger',
        restaurantLogoUrl: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
        rating: 4.7,
        price: 12000,
        deliveryTime: '25-35 мин',
        tags: ['Бургер', 'Түргэн хоол', 'Америк хоол'],
        isFavorite: userId ? this.favoriteRecipes.get(userId)?.has('3') || false : false
      },
      {
        id: '4',
        name: 'Пепперони Пицца',
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        restaurantName: 'Pizza Hub',
        restaurantLogoUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
        rating: 4.6,
        price: 24000,
        deliveryTime: '30-40 мин',
        tags: ['Итали хоол', 'Пицца', 'Түргэн хоол'],
        isFavorite: userId ? this.favoriteRecipes.get(userId)?.has('4') || false : false
      },
      {
        id: '5',
        name: 'Буузны цуглаан',
        imageUrl: 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        restaurantName: 'Монгол Гуанз',
        restaurantLogoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        price: 15000,
        deliveryTime: '20-30 мин',
        tags: ['Монгол хоол', 'Үндэсний хоол', 'Буузны газар'],
        isFavorite: userId ? this.favoriteRecipes.get(userId)?.has('5') || false : false
      }
    ];

    // In a real app, we would filter by user preferences, order history, etc.
    if (userId) {
      const user = Array.from(this.users.values()).find(u => u.uid === userId);
      if (user && user.preferences) {
        // Sort by preference matching
        return mockRecommendations
          .slice(0, limit)
          .sort((a, b) => {
            // Count matching tags with user preferences
            const aMatches = a.tags.filter(tag => user.preferences?.includes(tag)).length;
            const bMatches = b.tags.filter(tag => user.preferences?.includes(tag)).length;
            return bMatches - aMatches;
          });
      }
    }

    return mockRecommendations.slice(0, limit);
  }

  async getUserFavoriteRecipes(userId: string): Promise<RecipeRecommendation[]> {
    const userFavorites = this.favoriteRecipes.get(userId);
    if (!userFavorites || userFavorites.size === 0) {
      return [];
    }

    // Get all recommendations and filter to just the favorites
    const allRecipes = await this.getRecipeRecommendations(userId, 20);
    return allRecipes.filter(recipe => userFavorites.has(recipe.id));
  }

  async toggleFavoriteRecipe(userId: string, recipeId: string): Promise<boolean> {
    if (!this.favoriteRecipes.has(userId)) {
      this.favoriteRecipes.set(userId, new Set());
    }

    const userFavorites = this.favoriteRecipes.get(userId)!;
    
    // Toggle favorite status
    if (userFavorites.has(recipeId)) {
      userFavorites.delete(recipeId);
      return false; // No longer a favorite
    } else {
      userFavorites.add(recipeId);
      return true; // Now a favorite
    }
  }
}

export const storage = new MemStorage();
