import { describe, expect, it } from "vitest";
import { MAX_FILE_SIZE_BYTES, parseBase64Payload, sanitizeFilename } from "./fileStorage";

const pngData = `data:image/png;base64,${Buffer.from("sample-image").toString("base64")}`;

describe("file storage validation", () => {
  it("sanitizes filenames while keeping Arabic letters and extensions", () => {
    expect(sanitizeFilename("  قصة غزة / النسخة الأولى!.pdf ")).toBe("قصة-غزة-النسخة-الأولى.pdf");
  });

  it("parses an allowed data URL and derives a media category", () => {
    const result = parseBase64Payload(pngData);
    expect(result.mimeType).toBe("image/png");
    expect(result.defaultCategory).toBe("media");
    expect(result.buffer.toString()).toBe("sample-image");
  });

  it("rejects unsupported file types", () => {
    expect(() => parseBase64Payload("data:application/zip;base64,eno=", "application/zip")).toThrow(/غير مدعوم/);
  });

  it("rejects files larger than the configured limit", () => {
    const oversized = Buffer.alloc(MAX_FILE_SIZE_BYTES + 1).toString("base64");
    expect(() => parseBase64Payload(oversized, "text/plain")).toThrow(/8 ميغابايت/);
  });
});
