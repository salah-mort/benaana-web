import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { createStoredFile, deleteStoredFileMetadata, listStoredFiles } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { parseBase64Payload, sanitizeFilename } from "./fileStorage";
import { storagePut } from "./storage";

const fileCategory = z.enum(["story", "training", "report", "media", "other"]);

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
  files: router({
    list: protectedProcedure.query(async ({ ctx }) => listStoredFiles(ctx.user.id)),
    upload: protectedProcedure
      .input(z.object({
        filename: z.string().min(1).max(255),
        mimeType: z.string().optional(),
        category: fileCategory.default("other"),
        data: z.string().min(1).max(12_000_000),
      }))
      .mutation(async ({ ctx, input }) => {
        const parsed = parseBase64Payload(input.data, input.mimeType);
        const filename = sanitizeFilename(input.filename);
        const uploaded = await storagePut(
          `community-files/${ctx.user.id}/${Date.now()}-${filename}`,
          parsed.buffer,
          parsed.mimeType,
        );

        return createStoredFile({
          ownerId: ctx.user.id,
          filename,
          fileKey: uploaded.key,
          url: uploaded.url,
          mimeType: parsed.mimeType,
          sizeBytes: parsed.buffer.length,
          category: input.category === "other" ? parsed.defaultCategory : input.category,
        });
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const deleted = await deleteStoredFileMetadata(input.id, ctx.user.id);
        if (!deleted) {
          throw new TRPCError({ code: "NOT_FOUND", message: "الملف غير موجود أو لا تملك صلاحية حذفه." });
        }
        return { success: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
