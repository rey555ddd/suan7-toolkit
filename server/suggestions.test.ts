import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db module
vi.mock("./db", () => ({
  createSuggestion: vi.fn().mockResolvedValue({}),
  listSuggestions: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "測試用戶",
      type: "feature",
      content: "希望可以新增更多模板",
      status: "pending",
      likes: 0,
      createdAt: new Date("2025-04-10T00:00:00Z"),
    },
  ]),
  likeSuggestion: vi.fn().mockResolvedValue({}),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("suggestions router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("list: 回傳建議列表", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.suggestions.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("content");
  });

  it("create: 成功建立建議", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.suggestions.create({
      name: "小七粉絲",
      type: "feature",
      content: "希望可以新增更多模板，讓小編更方便",
    });
    expect(result).toEqual({ success: true });
  });

  it("create: 內容太短應拋出錯誤", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.suggestions.create({
        name: "測試",
        type: "bug",
        content: "短",
      })
    ).rejects.toThrow();
  });

  it("like: 成功按讚", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.suggestions.like({ id: 1 });
    expect(result).toEqual({ success: true });
  });
});
