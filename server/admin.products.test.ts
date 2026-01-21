import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  getProducts: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "Test Product",
      slug: "test-product",
      price: "99.90",
      stock: 10,
      status: "active",
    },
  ]),
  getProductById: vi.fn().mockResolvedValue({
    id: 1,
    name: "Test Product",
    slug: "test-product",
    price: "99.90",
    stock: 10,
    status: "active",
  }),
  createProduct: vi.fn().mockResolvedValue({ id: 1 }),
  updateProduct: vi.fn().mockResolvedValue({ success: true }),
  deleteProduct: vi.fn().mockResolvedValue({ success: true }),
  getCategories: vi.fn().mockResolvedValue([]),
  getOrders: vi.fn().mockResolvedValue([]),
  getAbandonedCarts: vi.fn().mockResolvedValue([]),
  getShippingRules: vi.fn().mockResolvedValue([]),
  getFees: vi.fn().mockResolvedValue([]),
  getOrderBumps: vi.fn().mockResolvedValue([]),
  getGifts: vi.fn().mockResolvedValue([]),
  getTrackingPixels: vi.fn().mockResolvedValue([]),
  getStoreSettings: vi.fn().mockResolvedValue([]),
  getCustomScripts: vi.fn().mockResolvedValue([]),
  getPaymentCards: vi.fn().mockResolvedValue([]),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("products router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows public access to list products", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.list({});

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Test Product");
  });

  it("allows public access to get product by id", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.getById({ id: 1 });

    expect(result).toBeDefined();
    expect(result?.name).toBe("Test Product");
  });

  it("allows admin to create product", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.create({
      name: "New Product",
      slug: "new-product",
      price: "149.90",
    });

    expect(result).toEqual({ id: 1 });
  });

  it("denies non-admin from creating product", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.products.create({
        name: "New Product",
        slug: "new-product",
        price: "149.90",
      })
    ).rejects.toThrow();
  });

  it("allows admin to update product", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.update({
      id: 1,
      name: "Updated Product",
    });

    expect(result).toEqual({ success: true });
  });

  it("allows admin to delete product", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.delete({ id: 1 });

    expect(result).toEqual({ success: true });
  });
});

describe("categories router", () => {
  it("allows admin to list categories", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.categories.list({});

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("orders router", () => {
  it("allows admin to list orders", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.orders.list({});

    expect(Array.isArray(result)).toBe(true);
  });

  it("denies non-admin from listing orders", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.orders.list({})).rejects.toThrow();
  });
});
