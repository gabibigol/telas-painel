import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  getDashboardStats: vi.fn().mockResolvedValue({
    totalRevenue: "45231.89",
    totalOrders: 150,
    totalProducts: 25,
    totalCategories: 8,
    totalUsers: 120,
    abandonedCarts: 15,
  }),
  getRecentOrders: vi.fn().mockResolvedValue([
    {
      id: 1,
      customerName: "João Silva",
      customerEmail: "joao@test.com",
      total: "149.90",
      orderStatus: "paid",
      createdAt: new Date(),
    },
    {
      id: 2,
      customerName: "Maria Santos",
      customerEmail: "maria@test.com",
      total: "89.90",
      orderStatus: "pending",
      createdAt: new Date(),
    },
  ]),
  getTopProducts: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "Fone Bluetooth",
      price: "149.90",
      stock: 100,
      imageUrl: null,
    },
    {
      id: 2,
      name: "Sérum Facial",
      price: "89.90",
      stock: 50,
      imageUrl: null,
    },
  ]),
  getUserByOpenId: vi.fn().mockResolvedValue({
    id: 1,
    openId: "admin-user",
    email: "admin@test.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  }),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@test.com",
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

function createNonAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@test.com",
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

describe("dashboard.stats", () => {
  it("returns dashboard statistics for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.stats();

    expect(result).toBeDefined();
    expect(result).toHaveProperty("totalRevenue");
    expect(result).toHaveProperty("totalOrders");
    expect(result).toHaveProperty("totalProducts");
  });

  it("rejects non-admin users", async () => {
    const ctx = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.dashboard.stats()).rejects.toThrow();
  });
});

describe("dashboard.recentOrders", () => {
  it("returns recent orders for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.recentOrders({ limit: 5 });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("dashboard.topProducts", () => {
  it("returns top products for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.topProducts({ limit: 5 });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});
