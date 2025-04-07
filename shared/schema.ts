import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase UID
  username: text("username").unique(),
  email: text("email").notNull(),
  password: text("password"), // Hashed password for local auth (optional, can use Firebase auth)
  name: text("name"),
  role: text("role").notNull().default("customer"), // customer, business, delivery
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),

  // Business specific fields
  businessName: text("business_name"),
  businessType: text("business_type"), // restaurant, grocery, pharmacy, retail
  businessAddress: text("business_address"),
  businessPhone: text("business_phone"),
  businessDescription: text("business_description"),
  
  // Delivery specific fields
  vehicleType: text("vehicle_type"), // car, motorcycle, bicycle, scooter
  licenseNumber: text("license_number"),
  isOnline: boolean("is_online").default(false),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  businessId: text("business_id").notNull(), // References users.uid for the business
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price").notNull(),
  category: text("category"),
  imageUrl: text("image_url"),
  status: text("status").default("active"), // active, out_of_stock, hidden
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull(),
  customerId: text("customer_id").notNull(), // References users.uid for the customer
  businessId: text("business_id").notNull(), // References users.uid for the business
  driverId: text("driver_id"), // References users.uid for the driver
  status: text("status").notNull().default("new"), // new, accepted, ready, picked_up, on-the-way, delivered, declined, cancelled
  total: numeric("total").notNull(),
  deliveryFee: numeric("delivery_fee"),
  driverTip: numeric("driver_tip"),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  deliveryAddress: text("delivery_address"),
  pickupAddress: text("pickup_address"),
  requestedTime: text("requested_time").default("ASAP"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Order Items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(), // References orders.id
  productId: integer("product_id").notNull(), // References products.id
  quantity: integer("quantity").notNull().default(1),
  price: numeric("price").notNull(),
  notes: text("notes"),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });

// Create types from schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

// Export select types
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
