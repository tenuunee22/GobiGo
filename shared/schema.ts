import { pgTable, text, serial, integer, boolean, timestamp, numeric, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  username: text("username").unique(),
  email: text("email").notNull(),
  password: text("password"),
  name: text("name"),
  role: text("role").notNull().default("customer"),
  profileImage: text("profile_image"),
  preferences: json("preferences").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  businessName: text("business_name"),
  businessType: text("business_type"),
  businessAddress: text("business_address"),
  businessPhone: text("business_phone"),
  businessDescription: text("business_description"),
  phone: text("phone"),
  primaryAddress: text("primary_address"),
  secondaryAddress: text("secondary_address"),
  workAddress: text("work_address"),
  vehicleType: text("vehicle_type"),
  licenseNumber: text("license_number"),
  isOnline: boolean("is_online").default(false),
});
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  businessId: text("business_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price").notNull(),
  category: text("category"),
  imageUrl: text("image_url"),
  status: text("status").default("active"),
  tags: json("tags").$type<string[]>().default([]),
  rating: numeric("rating").default("0"),
  ratingCount: integer("rating_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull(),
  customerId: text("customer_id").notNull(),
  businessId: text("business_id").notNull(),
  businessType: text("business_type"),
  driverId: text("driver_id"),
  status: text("status").notNull().default("new"),
  needsPreparation: boolean("needs_preparation").default(true),
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
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  price: numeric("price").notNull(),
  notes: text("notes"),
});
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export const recipeRecommendationSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  restaurantName: z.string(),
  restaurantLogoUrl: z.string().optional(),
  rating: z.number().default(0),
  price: z.number(),
  deliveryTime: z.string(),
  tags: z.array(z.string()).default([]),
  isFavorite: z.boolean().default(false),
});
export type RecipeRecommendation = z.infer<typeof recipeRecommendationSchema>;
