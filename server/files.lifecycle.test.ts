import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const storedRows: Array<Record<string, unknown>> = [];
let nextId = 1;

vi.mock("./db", () => ({
  listStoredFiles: vi.fn(async (ownerId: number) => storedRows.filter(row => row.ownerId === ownerId)),
  createStoredFile: vi.fn(async (file: Record<string, unknown>) => {
    const row = { ...file, id: nextId++, createdAt: new Date() };
    storedRows.push(row);
    return row;
  }),
  deleteStoredFileMetadata: vi.fn(async (id: number, ownerId: number) => {
    const index = storedRows.findIndex(row => row.id === id && row.ownerId === ownerId);
    if (index < 0) return false;
    storedRows.splice(index, 1);
    return true;
  }),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn(async (key: string) => ({ key, url: `/manus-storage/${key}` })),
}));

import { appRouter } from "./routers";

function contextFor(id: number): TrpcContext {
  return {
    user: {
      id,
      openId: `user-${id}`,
      email: `user-${id}@example.com`,
      name: `User ${id}`,
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("files lifecycle", () => {
  beforeEach(() => {
    storedRows.length = 0;
    nextId = 1;
  });

  it("keeps upload, list, and delete scoped to the owning user", async () => {
    const owner = appRouter.createCaller(contextFor(1));
    const otherUser = appRouter.createCaller(contextFor(2));
    const data = `data:application/pdf;base64,${Buffer.from("proposal").toString("base64")}`;

    const uploaded = await owner.files.upload({
      filename: "proposal.pdf",
      mimeType: "application/pdf",
      category: "report",
      data,
    });

    expect(uploaded?.ownerId).toBe(1);
    expect((await owner.files.list())).toHaveLength(1);
    expect((await otherUser.files.list())).toHaveLength(0);
    await expect(otherUser.files.delete({ id: uploaded!.id })).rejects.toThrow(/لا تملك/);
    expect((await owner.files.list())).toHaveLength(1);

    await owner.files.delete({ id: uploaded!.id });
    expect((await owner.files.list())).toHaveLength(0);
  });
});
