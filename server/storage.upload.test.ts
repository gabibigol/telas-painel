import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the storage module
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({
    key: "uploads/1-abc123.png",
    url: "https://storage.example.com/uploads/1-abc123.png",
  }),
  storageGet: vi.fn().mockResolvedValue({
    key: "uploads/1-abc123.png",
    url: "https://storage.example.com/uploads/1-abc123.png",
  }),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
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

describe("storage.upload", () => {
  it("uploads a file and returns the URL", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a simple base64 encoded test file (1x1 transparent PNG)
    const testBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    const result = await caller.storage.upload({
      fileName: "test-image.png",
      fileData: testBase64,
      contentType: "image/png",
      folder: "uploads",
    });

    expect(result.success).toBe(true);
    expect(result.url).toBeDefined();
    expect(result.key).toBeDefined();
    expect(result.fileName).toBe("test-image.png");
  });
});

describe("storage.getUrl", () => {
  it("returns a presigned URL for a file", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.storage.getUrl({
      fileKey: "uploads/1-abc123.png",
    });

    expect(result.url).toBeDefined();
    expect(result.key).toBe("uploads/1-abc123.png");
  });
});
