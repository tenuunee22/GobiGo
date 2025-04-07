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
  type InsertOrderItem
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem[]>;
  private currentUserId: number;
  private currentProductId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
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
}

export const storage = new MemStorage();
