import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Categories table - product categories
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  parentId: int("parentId"),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Products table - store products
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("originalPrice", { precision: 10, scale: 2 }),
  costPrice: decimal("costPrice", { precision: 10, scale: 2 }),
  sku: varchar("sku", { length: 100 }),
  barcode: varchar("barcode", { length: 100 }),
  stock: int("stock").default(0).notNull(),
  lowStockThreshold: int("lowStockThreshold").default(10),
  categoryId: int("categoryId"),
  imageUrl: text("imageUrl"),
  images: json("images").$type<string[]>(),
  variants: json("variants").$type<{ color?: string; size?: string; price?: number; stock?: number }[]>(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  soldCount: int("soldCount").default(0).notNull(),
  status: mysqlEnum("status", ["active", "inactive", "out_of_stock"]).default("active").notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  discount: int("discount").default(0),
  weight: decimal("weight", { precision: 10, scale: 2 }),
  dimensions: json("dimensions").$type<{ length?: number; width?: number; height?: number }>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Orders table - customer orders
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  userId: int("userId"),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 20 }),
  shippingAddress: json("shippingAddress").$type<{
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>(),
  billingAddress: json("billingAddress").$type<{
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shippingCost", { precision: 10, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["credit_card", "debit_card", "pix", "boleto"]).notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed", "refunded"]).default("pending").notNull(),
  orderStatus: mysqlEnum("orderStatus", ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  shippingMethod: varchar("shippingMethod", { length: 100 }),
  trackingCode: varchar("trackingCode", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order Items table - items in each order
 */
export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  productImage: text("productImage"),
  variant: json("variant").$type<{ color?: string; size?: string }>(),
  quantity: int("quantity").notNull(),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Abandoned Carts table - carts that were not completed
 */
export const abandonedCarts = mysqlTable("abandoned_carts", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 100 }),
  userId: int("userId"),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 20 }),
  items: json("items").$type<{
    productId: number;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
  }[]>(),
  totalValue: decimal("totalValue", { precision: 10, scale: 2 }).notNull(),
  recoveryEmailSent: boolean("recoveryEmailSent").default(false).notNull(),
  recoveryEmailSentAt: timestamp("recoveryEmailSentAt"),
  isRecovered: boolean("isRecovered").default(false).notNull(),
  recoveredOrderId: int("recoveredOrderId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AbandonedCart = typeof abandonedCarts.$inferSelect;
export type InsertAbandonedCart = typeof abandonedCarts.$inferInsert;

/**
 * Shipping Rules table - shipping configuration
 */
export const shippingRules = mysqlTable("shipping_rules", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["fixed", "weight_based", "price_based", "free"]).notNull(),
  minOrderValue: decimal("minOrderValue", { precision: 10, scale: 2 }),
  maxOrderValue: decimal("maxOrderValue", { precision: 10, scale: 2 }),
  minWeight: decimal("minWeight", { precision: 10, scale: 2 }),
  maxWeight: decimal("maxWeight", { precision: 10, scale: 2 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  estimatedDays: int("estimatedDays"),
  regions: json("regions").$type<string[]>(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ShippingRule = typeof shippingRules.$inferSelect;
export type InsertShippingRule = typeof shippingRules.$inferInsert;

/**
 * Fees table - platform and payment fees
 */
export const fees = mysqlTable("fees", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["percentage", "fixed"]).notNull(),
  value: decimal("value", { precision: 10, scale: 4 }).notNull(),
  appliesTo: mysqlEnum("appliesTo", ["all", "credit_card", "debit_card", "pix", "boleto"]).default("all").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Fee = typeof fees.$inferSelect;
export type InsertFee = typeof fees.$inferInsert;

/**
 * Order Bumps table - upsell offers at checkout
 */
export const orderBumps = mysqlTable("order_bumps", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  productId: int("productId").notNull(),
  discountType: mysqlEnum("discountType", ["percentage", "fixed"]).notNull(),
  discountValue: decimal("discountValue", { precision: 10, scale: 2 }).notNull(),
  triggerProductIds: json("triggerProductIds").$type<number[]>(),
  triggerMinValue: decimal("triggerMinValue", { precision: 10, scale: 2 }),
  displayPosition: mysqlEnum("displayPosition", ["before_checkout", "after_checkout", "cart_page"]).default("before_checkout").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  conversions: int("conversions").default(0).notNull(),
  views: int("views").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OrderBump = typeof orderBumps.$inferSelect;
export type InsertOrderBump = typeof orderBumps.$inferInsert;

/**
 * Gifts table - free gifts with purchase
 */
export const gifts = mysqlTable("gifts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  minOrderValue: decimal("minOrderValue", { precision: 10, scale: 2 }).notNull(),
  maxOrderValue: decimal("maxOrderValue", { precision: 10, scale: 2 }),
  stock: int("stock").default(0).notNull(),
  usedCount: int("usedCount").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Gift = typeof gifts.$inferSelect;
export type InsertGift = typeof gifts.$inferInsert;

/**
 * Tracking Pixels table - analytics and marketing pixels
 */
export const trackingPixels = mysqlTable("tracking_pixels", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  platform: mysqlEnum("platform", ["facebook", "google_analytics", "google_tag_manager", "tiktok", "custom"]).notNull(),
  pixelId: varchar("pixelId", { length: 255 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  events: json("events").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TrackingPixel = typeof trackingPixels.$inferSelect;
export type InsertTrackingPixel = typeof trackingPixels.$inferInsert;

/**
 * Store Settings table - general store configuration
 */
export const storeSettings = mysqlTable("store_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  type: mysqlEnum("type", ["string", "number", "boolean", "json"]).default("string").notNull(),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StoreSetting = typeof storeSettings.$inferSelect;
export type InsertStoreSetting = typeof storeSettings.$inferInsert;

/**
 * Custom Scripts table - header/footer scripts
 */
export const customScripts = mysqlTable("custom_scripts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  position: mysqlEnum("position", ["header", "footer"]).notNull(),
  content: text("content").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomScript = typeof customScripts.$inferSelect;
export type InsertCustomScript = typeof customScripts.$inferInsert;

/**
 * Payment Cards table - saved payment methods
 */
export const paymentCards = mysqlTable("payment_cards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  cardBrand: varchar("cardBrand", { length: 50 }).notNull(),
  lastFourDigits: varchar("lastFourDigits", { length: 4 }).notNull(),
  holderName: varchar("holderName", { length: 255 }).notNull(),
  expiryMonth: int("expiryMonth").notNull(),
  expiryYear: int("expiryYear").notNull(),
  tokenizedId: varchar("tokenizedId", { length: 255 }),
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PaymentCard = typeof paymentCards.$inferSelect;
export type InsertPaymentCard = typeof paymentCards.$inferInsert;
