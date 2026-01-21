import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { storagePut, storageGet } from "./storage";
import { z } from "zod";
import { nanoid } from "nanoid";
import * as db from "./db";

// Admin middleware - checks if user is admin
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new Error('Acesso negado. Apenas administradores podem acessar esta função.');
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // File Storage Router
  storage: router({
    upload: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileData: z.string(),
        contentType: z.string().default("application/octet-stream"),
        folder: z.string().optional().default("uploads"),
      }))
      .mutation(async ({ input, ctx }) => {
        const { fileName, fileData, contentType, folder } = input;
        const buffer = Buffer.from(fileData, "base64");
        const fileExtension = fileName.split('.').pop() || '';
        const uniqueId = nanoid(10);
        const fileKey = `${folder}/${ctx.user.id}-${uniqueId}.${fileExtension}`;
        const result = await storagePut(fileKey, buffer, contentType);
        return { success: true, key: result.key, url: result.url, fileName };
      }),
    getUrl: protectedProcedure
      .input(z.object({ fileKey: z.string() }))
      .query(async ({ input }) => {
        const result = await storageGet(input.fileKey);
        return { key: result.key, url: result.url };
      }),
  }),

  // ==================== PRODUCTS ====================
  products: router({
    list: publicProcedure
      .input(z.object({
        search: z.string().optional(),
        categoryId: z.number().optional(),
        status: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getProducts(input);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductById(input.id);
      }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        price: z.string(),
        originalPrice: z.string().optional(),
        costPrice: z.string().optional(),
        sku: z.string().optional(),
        barcode: z.string().optional(),
        stock: z.number().default(0),
        lowStockThreshold: z.number().optional(),
        categoryId: z.number().optional(),
        imageUrl: z.string().optional(),
        images: z.array(z.string()).optional(),
        variants: z.array(z.object({
          color: z.string().optional(),
          size: z.string().optional(),
          price: z.number().optional(),
          stock: z.number().optional(),
        })).optional(),
        status: z.enum(['active', 'inactive', 'out_of_stock']).default('active'),
        isFeatured: z.boolean().default(false),
        discount: z.number().optional(),
        weight: z.string().optional(),
        dimensions: z.object({
          length: z.number().optional(),
          width: z.number().optional(),
          height: z.number().optional(),
        }).optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createProduct(input as any);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        originalPrice: z.string().optional(),
        costPrice: z.string().optional(),
        sku: z.string().optional(),
        barcode: z.string().optional(),
        stock: z.number().optional(),
        lowStockThreshold: z.number().optional(),
        categoryId: z.number().optional(),
        imageUrl: z.string().optional(),
        images: z.array(z.string()).optional(),
        variants: z.array(z.object({
          color: z.string().optional(),
          size: z.string().optional(),
          price: z.number().optional(),
          stock: z.number().optional(),
        })).optional(),
        status: z.enum(['active', 'inactive', 'out_of_stock']).optional(),
        isFeatured: z.boolean().optional(),
        discount: z.number().optional(),
        weight: z.string().optional(),
        dimensions: z.object({
          length: z.number().optional(),
          width: z.number().optional(),
          height: z.number().optional(),
        }).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateProduct(id, data as any);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteProduct(input.id);
      }),
  }),

  // ==================== CATEGORIES ====================
  categories: router({
    list: publicProcedure
      .input(z.object({
        search: z.string().optional(),
        isActive: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getCategories(input);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCategoryById(input.id);
      }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        parentId: z.number().optional(),
        isActive: z.boolean().default(true),
        sortOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        return await db.createCategory(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        parentId: z.number().optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateCategory(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteCategory(input.id);
      }),
  }),

  // ==================== ORDERS ====================
  orders: router({
    list: adminProcedure
      .input(z.object({
        search: z.string().optional(),
        status: z.string().optional(),
        paymentStatus: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getOrders(input);
      }),

    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const order = await db.getOrderById(input.id);
        const items = await db.getOrderItems(input.id);
        return { order, items };
      }),

    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        orderStatus: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
        paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
        trackingCode: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateOrder(id, data as any);
      }),
  }),

  // ==================== ABANDONED CARTS ====================
  abandonedCarts: router({
    list: adminProcedure
      .input(z.object({
        search: z.string().optional(),
        isRecovered: z.boolean().optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAbandonedCarts(input);
      }),

    markRecovered: adminProcedure
      .input(z.object({
        id: z.number(),
        recoveredOrderId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.updateAbandonedCart(input.id, {
          isRecovered: true,
          recoveredOrderId: input.recoveredOrderId,
        });
      }),

    sendRecoveryEmail: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        // TODO: Implement email sending
        return await db.updateAbandonedCart(input.id, {
          recoveryEmailSent: true,
          recoveryEmailSentAt: new Date(),
        });
      }),
  }),

  // ==================== SHIPPING RULES ====================
  shippingRules: router({
    list: adminProcedure.query(async () => {
      return await db.getShippingRules();
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        type: z.enum(['fixed', 'weight_based', 'price_based', 'free']),
        minOrderValue: z.string().optional(),
        maxOrderValue: z.string().optional(),
        minWeight: z.string().optional(),
        maxWeight: z.string().optional(),
        price: z.string(),
        estimatedDays: z.number().optional(),
        regions: z.array(z.string()).optional(),
        isActive: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        return await db.createShippingRule(input as any);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        type: z.enum(['fixed', 'weight_based', 'price_based', 'free']).optional(),
        minOrderValue: z.string().optional(),
        maxOrderValue: z.string().optional(),
        minWeight: z.string().optional(),
        maxWeight: z.string().optional(),
        price: z.string().optional(),
        estimatedDays: z.number().optional(),
        regions: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateShippingRule(id, data as any);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteShippingRule(input.id);
      }),
  }),

  // ==================== FEES ====================
  fees: router({
    list: adminProcedure.query(async () => {
      return await db.getFees();
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        type: z.enum(['percentage', 'fixed']),
        value: z.string(),
        appliesTo: z.enum(['all', 'credit_card', 'debit_card', 'pix', 'boleto']).default('all'),
        isActive: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        return await db.createFee(input as any);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        type: z.enum(['percentage', 'fixed']).optional(),
        value: z.string().optional(),
        appliesTo: z.enum(['all', 'credit_card', 'debit_card', 'pix', 'boleto']).optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateFee(id, data as any);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteFee(input.id);
      }),
  }),

  // ==================== ORDER BUMPS ====================
  orderBumps: router({
    list: adminProcedure.query(async () => {
      return await db.getOrderBumps();
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        productId: z.number(),
        discountType: z.enum(['percentage', 'fixed']),
        discountValue: z.string(),
        triggerProductIds: z.array(z.number()).optional(),
        triggerMinValue: z.string().optional(),
        displayPosition: z.enum(['before_checkout', 'after_checkout', 'cart_page']).default('before_checkout'),
        isActive: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        return await db.createOrderBump(input as any);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        productId: z.number().optional(),
        discountType: z.enum(['percentage', 'fixed']).optional(),
        discountValue: z.string().optional(),
        triggerProductIds: z.array(z.number()).optional(),
        triggerMinValue: z.string().optional(),
        displayPosition: z.enum(['before_checkout', 'after_checkout', 'cart_page']).optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateOrderBump(id, data as any);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteOrderBump(input.id);
      }),
  }),

  // ==================== GIFTS ====================
  gifts: router({
    list: adminProcedure.query(async () => {
      return await db.getGifts();
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        minOrderValue: z.string(),
        maxOrderValue: z.string().optional(),
        stock: z.number().default(0),
        isActive: z.boolean().default(true),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createGift(input as any);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        minOrderValue: z.string().optional(),
        maxOrderValue: z.string().optional(),
        stock: z.number().optional(),
        isActive: z.boolean().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateGift(id, data as any);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteGift(input.id);
      }),
  }),

  // ==================== TRACKING PIXELS ====================
  trackingPixels: router({
    list: adminProcedure.query(async () => {
      return await db.getTrackingPixels();
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        platform: z.enum(['facebook', 'google_analytics', 'google_tag_manager', 'tiktok', 'custom']),
        pixelId: z.string().min(1),
        isActive: z.boolean().default(true),
        events: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createTrackingPixel(input as any);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        platform: z.enum(['facebook', 'google_analytics', 'google_tag_manager', 'tiktok', 'custom']).optional(),
        pixelId: z.string().optional(),
        isActive: z.boolean().optional(),
        events: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateTrackingPixel(id, data as any);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteTrackingPixel(input.id);
      }),
  }),

  // ==================== STORE SETTINGS ====================
  storeSettings: router({
    list: adminProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getStoreSettings(input?.category);
      }),

    get: adminProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ input }) => {
        return await db.getStoreSetting(input.key);
      }),

    upsert: adminProcedure
      .input(z.object({
        key: z.string().min(1),
        value: z.string().optional(),
        type: z.enum(['string', 'number', 'boolean', 'json']).default('string'),
        category: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.upsertStoreSetting(input);
      }),
  }),

  // ==================== CUSTOM SCRIPTS ====================
  customScripts: router({
    list: adminProcedure.query(async () => {
      return await db.getCustomScripts();
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        position: z.enum(['header', 'footer']),
        content: z.string().min(1),
        isActive: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        return await db.createCustomScript(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        position: z.enum(['header', 'footer']).optional(),
        content: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateCustomScript(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteCustomScript(input.id);
      }),
  }),

  // ==================== DASHBOARD ====================
  dashboard: router({
    stats: adminProcedure.query(async () => {
      return await db.getDashboardStats();
    }),

    recentOrders: adminProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getRecentOrders(input?.limit || 5);
      }),

    topProducts: adminProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getTopProducts(input?.limit || 5);
      }),
  }),
});

export type AppRouter = typeof appRouter;
