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
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByBusiness(businessUid: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderWithItems(id: number): Promise<{ order: Order; items: OrderItem[] } | undefined>;
  getOrdersByCustomer(customerUid: string): Promise<Order[]>;
  getOrdersByBusiness(businessUid: string): Promise<Order[]>;
  getOrdersByDriver(driverUid: string): Promise<Order[]>;
  getAvailableOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string, driverId?: string): Promise<Order | undefined>;
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
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
      completedAt: null
    };
    this.orders.set(id, order);
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
    if (driverId) {
      updatedOrder.driverId = driverId;
    }
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  async getRecipeRecommendations(userId?: string, limit: number = 10): Promise<RecipeRecommendation[]> {
    const mockRecommendations: RecipeRecommendation[] = [
      {
        id: '1',
        name: 'Ногоотой Хуушуур',
        imageUrl: 'https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?q=80',
        restaurantName: 'Хүслэн Ресторан',
        restaurantLogoUrl: 'https://ui-avatars.com/api/?name=ХР&color=fff&background=FF5722',
        rating: 4.8,
        price: 8000,
        deliveryTime: '20-30 мин',
        tags: ['Монгол хоол', 'Үндэсний хоол', 'Түргэн хоол'],
        isFavorite: userId ? this.favoriteRecipes.get(userId)?.has('1') || false : false
      },
      {
        id: '2',
        name: 'Өндөгтэй будаа',
        imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80',
        restaurantName: 'Garden Cafe',
        restaurantLogoUrl: 'https://ui-avatars.com/api/?name=GC&color=fff&background=4CAF50',
        rating: 4.5,
        price: 9500,
        deliveryTime: '15-25 мин',
        tags: ['Солонгос хоол', 'Эрүүл хоол', 'Амттан'],
        isFavorite: userId ? this.favoriteRecipes.get(userId)?.has('2') || false : false
      },
      {
        id: '3',
        name: 'Том Бургер',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80',
        restaurantName: 'Big Burger',
        restaurantLogoUrl: 'https://ui-avatars.com/api/?name=BB&color=fff&background=FF9800',
        rating: 4.7,
        price: 12000,
        deliveryTime: '25-35 мин',
        tags: ['Бургер', 'Түргэн хоол', 'Америк хоол'],
        isFavorite: userId ? this.favoriteRecipes.get(userId)?.has('3') || false : false
      },
      {
        id: '4',
        name: 'Пепперони Пицца',
        imageUrl: 'https://images.unsplash.com/photo-1593560708920-61b98681d5ef?q=80',
        restaurantName: 'Pizza Hub',
        restaurantLogoUrl: 'https://ui-avatars.com/api/?name=PH&color=fff&background=F44336',
        rating: 4.6,
        price: 24000,
        deliveryTime: '30-40 мин',
        tags: ['Итали хоол', 'Пицца', 'Түргэн хоол'],
        isFavorite: userId ? this.favoriteRecipes.get(userId)?.has('4') || false : false
      },
      {
        id: '5',
        name: 'Буузны цуглаан',
        imageUrl: 'https://images.unsplash.com/photo-1577859714523-5f0b6c98ece5?q=80',
        restaurantName: 'Монгол Гуанз',
        restaurantLogoUrl: 'https://ui-avatars.com/api/?name=МГ&color=fff&background=009688',
        rating: 4.9,
        price: 15000,
        deliveryTime: '20-30 мин',
        tags: ['Монгол хоол', 'Үндэсний хоол', 'Буузны газар'],
        isFavorite: userId ? this.favoriteRecipes.get(userId)?.has('5') || false : false
      }
    ];
    if (userId) {
      const user = Array.from(this.users.values()).find(u => u.uid === userId);
      if (user && user.preferences) {
        return mockRecommendations
          .slice(0, limit)
          .sort((a, b) => {
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
    const allRecipes = await this.getRecipeRecommendations(userId, 20);
    return allRecipes.filter(recipe => userFavorites.has(recipe.id));
  }
  async toggleFavoriteRecipe(userId: string, recipeId: string): Promise<boolean> {
    if (!this.favoriteRecipes.has(userId)) {
      this.favoriteRecipes.set(userId, new Set());
    }
    const userFavorites = this.favoriteRecipes.get(userId)!;
    if (userFavorites.has(recipeId)) {
      userFavorites.delete(recipeId);
      return false;
    } else {
      userFavorites.add(recipeId);
      return true;
    }
  }
}
export const storage = new MemStorage();
