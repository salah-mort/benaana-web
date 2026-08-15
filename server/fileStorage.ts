import { TRPCError } from "@trpc/server";

export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

export const ALLOWED_FILE_TYPES = {
  "image/jpeg": "media",
  "image/png": "media",
  "image/webp": "media",
  "application/pdf": "report",
  "text/plain": "other",
} as const;

export type FileCategory = "story" | "training" | "report" | "media" | "other";

export function sanitizeFilename(filename: string) {
  const cleaned = filename
    .trim()
    .replace(/[^A-Za-z0-9_\-\u0600-\u06FF.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/-+\./g, ".")
    .slice(0, 180);
  return cleaned || "shared-file";
}

export function parseBase64Payload(data: string, declaredMimeType?: string) {
  const match = data.match(/^data:([^;]+);base64,([\s\S]+)$/);
  const mimeType = match?.[1] || declaredMimeType || "application/octet-stream";
  const encoded = match?.[2] || data;
  const buffer = Buffer.from(encoded, "base64");

  if (!buffer.length) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "الملف المرسل فارغ أو غير صالح." });
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "حجم الملف يتجاوز الحد المسموح وهو 8 ميغابايت." });
  }

  if (!(mimeType in ALLOWED_FILE_TYPES)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "نوع الملف غير مدعوم. استخدم صورة أو PDF أو ملفاً نصياً." });
  }

  return { buffer, mimeType, defaultCategory: ALLOWED_FILE_TYPES[mimeType as keyof typeof ALLOWED_FILE_TYPES] as FileCategory };
}
