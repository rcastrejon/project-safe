import { Elysia } from "elysia";

import { userModel } from "../models/user";
import {
  AccountsService,
  InvalidEmailPasswordError,
} from "../services/accounts";
import { authService } from "../services/auth";

export const sessionsController = new Elysia()
  .use(authService)
  .use(userModel)
  // POST /sign-in
  // Auth: none
  .post(
    "/sign-in",
    async ({ body, error }) => {
      try {
        const user = await AccountsService.fetchUserByEmailPassword(body);
        const session = await AccountsService.generateUserSession(user);
        return { session };
      } catch (e) {
        if (e instanceof InvalidEmailPasswordError) {
          return error(400, { error: e.message });
        }
      }
    },
    {
      body: "user.sign-in",
      transform({ body }) {
        body.email = body.email?.toLowerCase();
      },
    },
  )
  // POST /logout
  .post("/logout", async ({ session, error }) => {
    if (!session) return error(401, { error: "Unauthorized" });
    await AccountsService.deleteSession(session);
    return { success: true };
  });
