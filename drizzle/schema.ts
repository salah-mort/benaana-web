import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * File metadata for the S3-backed Manus storage layer.
 * File bytes stay in storage; the database keeps only ownership and references.
 */
export const storedFiles = mysqlTable("stored_files", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull().unique(),
  url: varchar("url", { length: 768 }).notNull(),
  mimeType: varchar("mimeType", { length: 160 }).notNull(),
  sizeBytes: int("sizeBytes").notNull(),
  category: mysqlEnum("category", ["story", "training", "report", "media", "other"]).default("other").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StoredFile = typeof storedFiles.$inferSelect;
export type InsertStoredFile = typeof storedFiles.$inferInsert;
