import { sessionTable } from "../../src/db/schema";

type SessionTable = typeof sessionTable.$inferInsert;

export const sessions: SessionTable[] = [
  {
    id: "auth_session",
    userId: "john",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  },
];
