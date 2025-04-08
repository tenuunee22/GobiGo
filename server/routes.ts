import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProductSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Missing Stripe secret key! Payment functionality will not work.");
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // All routes are prefixed with /api
  
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/uid/:uid", async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await storage.getUserByUid(uid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedUser = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedUser);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, validatedData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Product routes
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/products/business/:businessUid", async (req, res) => {
    try {
      const { businessUid } = req.params;
      const products = await storage.getProductsByBusiness(businessUid);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedProduct = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedProduct);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Order routes
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const orderData = await storage.getOrderWithItems(id);
      if (!orderData) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(orderData);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/orders/customer/:customerUid", async (req, res) => {
    try {
      const { customerUid } = req.params;
      const orders = await storage.getOrdersByCustomer(customerUid);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/orders/business/:businessUid", async (req, res) => {
    try {
      const { businessUid } = req.params;
      const orders = await storage.getOrdersByBusiness(businessUid);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/orders/driver/:driverUid", async (req, res) => {
    try {
      const { driverUid } = req.params;
      const orders = await storage.getOrdersByDriver(driverUid);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/orders/available", async (req, res) => {
    try {
      const orders = await storage.getAvailableOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const { order, items } = req.body;
      const validatedOrder = insertOrderSchema.parse(order);
      const validatedItems = items.map((item: any) => insertOrderItemSchema.parse(item));
      
      const newOrder = await storage.createOrder(validatedOrder, validatedItems);
      res.status(201).json(newOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, driverId } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(id, status, driverId);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Stripe payment endpoints
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ 
          message: "Payment service not available. Please check server configuration." 
        });
      }

      const { amount, orderId, customerName, customerEmail } = req.body;
      
      if (!amount || amount < 1) {
        return res.status(400).json({ message: "Valid amount is required" });
      }

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to smallest currency unit (cents/tögrög)
        currency: "mnt", // Mongolian tögrög
        // Store order information in the metadata
        metadata: {
          orderId: orderId || '',
          customerName: customerName || 'Guest',
          customerEmail: customerEmail || ''
        },
        description: `GobiGo Order #${orderId || 'New'}`,
        payment_method_types: ['card'],
      });

      // Return the client secret to the client
      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        message: "Error creating payment intent", 
        error: error.message 
      });
    }
  });
  
  // QPay integration endpoint (simulate QPay for demonstration purposes)
  app.post("/api/create-qpay-payment", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ 
          message: "Payment service not available. Please check server configuration." 
        });
      }

      const { amount, orderId, customerName, customerPhone } = req.body;
      
      if (!amount || amount < 1) {
        return res.status(400).json({ message: "Valid amount is required" });
      }

      // In a real implementation, this would call the QPay API
      // For demonstration purposes, we'll use Stripe as the backend
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "mnt",
        metadata: {
          orderId: orderId || '',
          customerName: customerName || 'Guest',
          customerPhone: customerPhone || '',
          paymentMethod: 'QPay'
        },
        description: `GobiGo QPay Payment for Order #${orderId || 'New'}`,
        payment_method_types: ['card'], // In a real QPay integration, this would be different
      });

      // Simulate QPay callback URL and payment information
      res.json({
        success: true,
        qpayInvoiceId: `QPAY-${Date.now()}`,
        qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + 
                  encodeURIComponent(`https://qpay.mn/payment/${paymentIntent.id}`),
        paymentIntentId: paymentIntent.id,
        amount: amount,
        deepLink: {
          qPay: `qpay://payment/invoice?invoiceId=${paymentIntent.id}&callback=gobigo://order/callback`,
          eBarimt: `ebarimt://payment?amount=${amount}&orderId=${orderId || 'New'}`
        }
      });
    } catch (error: any) {
      console.error("Error creating QPay payment:", error);
      res.status(500).json({ 
        message: "Error creating QPay payment", 
        error: error.message 
      });
    }
  });

  // Check payment status endpoint
  app.get("/api/check-payment/:paymentIntentId", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ 
          message: "Payment service not available. Please check server configuration." 
        });
      }

      const { paymentIntentId } = req.params;
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      res.json({
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert back from smallest currency unit
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      });
    } catch (error: any) {
      console.error("Error checking payment status:", error);
      res.status(500).json({ 
        message: "Error checking payment status", 
        error: error.message 
      });
    }
  });

  // Direct Stripe Checkout endpoint
  app.post("/api/stripe-checkout", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ 
          message: "Payment service not available. Please check server configuration." 
        });
      }

      const { amount, orderId, customerName, customerEmail, successUrl, cancelUrl } = req.body;
      
      if (!amount || amount < 1) {
        return res.status(400).json({ message: "Valid amount is required" });
      }

      // Create a Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'mnt',
              product_data: {
                name: `GobiGo Order #${orderId || 'New'}`,
                description: `Food delivery from GobiGo`,
              },
              unit_amount: Math.round(amount * 100), // Convert to smallest currency unit
            },
            quantity: 1,
          },
        ],
        metadata: {
          orderId: orderId || '',
          customerName: customerName || 'Guest',
          customerEmail: customerEmail || ''
        },
        mode: 'payment',
        success_url: successUrl || `${req.protocol}://${req.get('host')}/order/${orderId || ''}?success=true`,
        cancel_url: cancelUrl || `${req.protocol}://${req.get('host')}/order/${orderId || ''}?canceled=true`,
      });

      // Return the URL to the client
      res.json({
        url: session.url,
        sessionId: session.id
      });
    } catch (error: any) {
      console.error("Error creating Stripe Checkout session:", error);
      res.status(500).json({ 
        message: "Error creating Stripe Checkout session", 
        error: error.message 
      });
    }
  });
  
  // Stripe Static Checkout Redirect
  app.get("/api/stripe-static-checkout", (req, res) => {
    // Redirect to the provided static Stripe checkout link
    const staticCheckoutUrl = "https://buy.stripe.com/test_8wM15p4kW8886cw000";
    res.redirect(staticCheckoutUrl);
  });

  // Recipe recommendation endpoints
  app.get("/api/recommendations", async (req, res) => {
    try {
      const { userId, limit = 10 } = req.query;
      const recommendations = await storage.getRecipeRecommendations(
        userId as string, 
        parseInt(limit as string) || 10
      );
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Error fetching recommendations" });
    }
  });

  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const favorites = await storage.getUserFavoriteRecipes(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
      res.status(500).json({ message: "Error fetching favorite recipes" });
    }
  });

  app.post("/api/favorites/toggle", async (req, res) => {
    try {
      const { userId, recipeId } = req.body;
      
      if (!userId || !recipeId) {
        return res.status(400).json({ message: "userId and recipeId are required" });
      }
      
      const isFavorite = await storage.toggleFavoriteRecipe(userId, recipeId);
      res.json({ recipeId, isFavorite });
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      res.status(500).json({ message: "Error toggling favorite status" });
    }
  });

  // Create the HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
