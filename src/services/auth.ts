import { Elysia } from "elysia";

import { lucia } from "../utils/auth";

export const authService = new Elysia({ name: "Service.UserAuth" }).derive(
  { as: "scoped" },
  async ({ headers }) => {
    const authorizationHeader = headers.authorization;
    const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
    if (!sessionId) return {};
    const { session, user } = await lucia.validateSession(sessionId);
    return { session, user };
  },
);
