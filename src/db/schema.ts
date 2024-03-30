import { pgTable, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: varchar("id", { length: 256 }).primaryKey(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  hashedPassword: varchar("hashed_password").notNull(),
});
