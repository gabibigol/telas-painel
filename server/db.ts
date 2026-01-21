import { eq, desc, asc, sql, like, and, or, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  InsertProduct, products, Product,
  InsertCategory, categories, Category,
  InsertOrder, orders, Order,
  InsertOrderItem, orderItems,
  InsertAbandonedCart, abandonedCarts, AbandonedCart,
  InsertShippingRule, shippingRules, ShippingRule,
  InsertFee, fees, Fee,
  InsertOrderBump, orderBumps, OrderBump,
  InsertGift, gifts, Gift,
  InsertTrackingPixel, trackingPixels, TrackingPixel,
  InsertStoreSetting, storeSettings, StoreSetting,
  InsertCustomScript, customScripts,
  InsertPaymentCard, paymentCards,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== USERS ====================
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== PRODUCTS ====================
export async function getProducts(options?: { 
  search?: string; 
  categoryId?: number; 
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(products);
  
  const conditions = [];
  if (options?.search) {
    conditions.push(like(products.name, `%${options.search}%`));
  }
  if (options?.categoryId) {
    conditions.push(eq(products.categoryId, options.categoryId));
  }
  if (options?.status) {
    conditions.push(eq(products.status, options.status as any));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  const result = await query.orderBy(desc(products.createdAt)).limit(options?.limit || 100);
  return result;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(products).values(product);
  return { id: result[0].insertId };
}

export async function updateProduct(id: number, product: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(products).set(product).where(eq(products.id, id));
  return { success: true };
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(products).where(eq(products.id, id));
  return { success: true };
}

// ==================== CATEGORIES ====================
export async function getCategories(options?: { search?: string; isActive?: boolean }) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(categories);
  
  const conditions = [];
  if (options?.search) {
    conditions.push(like(categories.name, `%${options.search}%`));
  }
  if (options?.isActive !== undefined) {
    conditions.push(eq(categories.isActive, options.isActive));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  const result = await query.orderBy(asc(categories.sortOrder));
  return result;
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createCategory(category: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(categories).values(category);
  return { id: result[0].insertId };
}

export async function updateCategory(id: number, category: Partial<InsertCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(categories).set(category).where(eq(categories.id, id));
  return { success: true };
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(categories).where(eq(categories.id, id));
  return { success: true };
}

// ==================== ORDERS ====================
export async function getOrders(options?: { 
  search?: string; 
  status?: string;
  paymentStatus?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(orders);
  
  const conditions = [];
  if (options?.search) {
    conditions.push(or(
      like(orders.orderNumber, `%${options.search}%`),
      like(orders.customerName, `%${options.search}%`),
      like(orders.customerEmail, `%${options.search}%`)
    ));
  }
  if (options?.status) {
    conditions.push(eq(orders.orderStatus, options.status as any));
  }
  if (options?.paymentStatus) {
    conditions.push(eq(orders.paymentStatus, options.paymentStatus as any));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  const result = await query.orderBy(desc(orders.createdAt)).limit(options?.limit || 100);
  return result;
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function createOrder(order: InsertOrder, items: InsertOrderItem[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const orderResult = await db.insert(orders).values(order);
  const orderId = orderResult[0].insertId;

  if (items.length > 0) {
    const itemsWithOrderId = items.map(item => ({ ...item, orderId }));
    await db.insert(orderItems).values(itemsWithOrderId);
  }

  return { id: orderId };
}

export async function updateOrder(id: number, order: Partial<InsertOrder>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(orders).set(order).where(eq(orders.id, id));
  return { success: true };
}

// ==================== ABANDONED CARTS ====================
export async function getAbandonedCarts(options?: { 
  search?: string; 
  isRecovered?: boolean;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(abandonedCarts);
  
  const conditions = [];
  if (options?.search) {
    conditions.push(or(
      like(abandonedCarts.customerEmail, `%${options.search}%`),
      like(abandonedCarts.customerPhone, `%${options.search}%`)
    ));
  }
  if (options?.isRecovered !== undefined) {
    conditions.push(eq(abandonedCarts.isRecovered, options.isRecovered));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  const result = await query.orderBy(desc(abandonedCarts.createdAt)).limit(options?.limit || 100);
  return result;
}

export async function createAbandonedCart(cart: InsertAbandonedCart) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(abandonedCarts).values(cart);
  return { id: result[0].insertId };
}

export async function updateAbandonedCart(id: number, cart: Partial<InsertAbandonedCart>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(abandonedCarts).set(cart).where(eq(abandonedCarts.id, id));
  return { success: true };
}

// ==================== SHIPPING RULES ====================
export async function getShippingRules() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(shippingRules).orderBy(asc(shippingRules.name));
}

export async function createShippingRule(rule: InsertShippingRule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(shippingRules).values(rule);
  return { id: result[0].insertId };
}

export async function updateShippingRule(id: number, rule: Partial<InsertShippingRule>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(shippingRules).set(rule).where(eq(shippingRules.id, id));
  return { success: true };
}

export async function deleteShippingRule(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(shippingRules).where(eq(shippingRules.id, id));
  return { success: true };
}

// ==================== FEES ====================
export async function getFees() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(fees).orderBy(asc(fees.name));
}

export async function createFee(fee: InsertFee) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(fees).values(fee);
  return { id: result[0].insertId };
}

export async function updateFee(id: number, fee: Partial<InsertFee>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(fees).set(fee).where(eq(fees.id, id));
  return { success: true };
}

export async function deleteFee(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(fees).where(eq(fees.id, id));
  return { success: true };
}

// ==================== ORDER BUMPS ====================
export async function getOrderBumps() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(orderBumps).orderBy(desc(orderBumps.createdAt));
}

export async function createOrderBump(bump: InsertOrderBump) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(orderBumps).values(bump);
  return { id: result[0].insertId };
}

export async function updateOrderBump(id: number, bump: Partial<InsertOrderBump>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(orderBumps).set(bump).where(eq(orderBumps.id, id));
  return { success: true };
}

export async function deleteOrderBump(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(orderBumps).where(eq(orderBumps.id, id));
  return { success: true };
}

// ==================== GIFTS ====================
export async function getGifts() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(gifts).orderBy(desc(gifts.createdAt));
}

export async function createGift(gift: InsertGift) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(gifts).values(gift);
  return { id: result[0].insertId };
}

export async function updateGift(id: number, gift: Partial<InsertGift>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(gifts).set(gift).where(eq(gifts.id, id));
  return { success: true };
}

export async function deleteGift(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(gifts).where(eq(gifts.id, id));
  return { success: true };
}

// ==================== TRACKING PIXELS ====================
export async function getTrackingPixels() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(trackingPixels).orderBy(asc(trackingPixels.name));
}

export async function createTrackingPixel(pixel: InsertTrackingPixel) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(trackingPixels).values(pixel);
  return { id: result[0].insertId };
}

export async function updateTrackingPixel(id: number, pixel: Partial<InsertTrackingPixel>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(trackingPixels).set(pixel).where(eq(trackingPixels.id, id));
  return { success: true };
}

export async function deleteTrackingPixel(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(trackingPixels).where(eq(trackingPixels.id, id));
  return { success: true };
}

// ==================== STORE SETTINGS ====================
export async function getStoreSettings(category?: string) {
  const db = await getDb();
  if (!db) return [];

  if (category) {
    return await db.select().from(storeSettings).where(eq(storeSettings.category, category));
  }
  return await db.select().from(storeSettings);
}

export async function getStoreSetting(key: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(storeSettings).where(eq(storeSettings.key, key)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function upsertStoreSetting(setting: InsertStoreSetting) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(storeSettings).values(setting).onDuplicateKeyUpdate({
    set: { value: setting.value, type: setting.type, category: setting.category, description: setting.description }
  });
  return { success: true };
}

// ==================== CUSTOM SCRIPTS ====================
export async function getCustomScripts() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(customScripts).orderBy(asc(customScripts.position));
}

export async function createCustomScript(script: InsertCustomScript) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(customScripts).values(script);
  return { id: result[0].insertId };
}

export async function updateCustomScript(id: number, script: Partial<InsertCustomScript>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(customScripts).set(script).where(eq(customScripts.id, id));
  return { success: true };
}

export async function deleteCustomScript(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(customScripts).where(eq(customScripts.id, id));
  return { success: true };
}

// ==================== DASHBOARD STATS ====================
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return null;

  const [totalOrders] = await db.select({ count: sql<number>`count(*)` }).from(orders);
  const [totalProducts] = await db.select({ count: sql<number>`count(*)` }).from(products);
  const [totalCategories] = await db.select({ count: sql<number>`count(*)` }).from(categories);
  const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users);
  
  const [revenue] = await db.select({ 
    total: sql<string>`COALESCE(SUM(total), 0)` 
  }).from(orders).where(eq(orders.paymentStatus, 'paid'));

  const [abandonedCartsCount] = await db.select({ count: sql<number>`count(*)` }).from(abandonedCarts).where(eq(abandonedCarts.isRecovered, false));

  return {
    totalOrders: totalOrders?.count || 0,
    totalProducts: totalProducts?.count || 0,
    totalCategories: totalCategories?.count || 0,
    totalUsers: totalUsers?.count || 0,
    totalRevenue: parseFloat(revenue?.total || '0'),
    abandonedCarts: abandonedCartsCount?.count || 0,
  };
}

export async function getRecentOrders(limit: number = 5) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit);
}

export async function getTopProducts(limit: number = 5) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(products).orderBy(desc(products.soldCount)).limit(limit);
}
