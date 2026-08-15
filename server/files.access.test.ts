import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("files access", () => {
  it("requires an authenticated session before listing files", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    await expect(appRouter.createCaller(ctx).files.list()).rejects.toThrow(/login/i);
  });
});
