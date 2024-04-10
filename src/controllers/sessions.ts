import { Elysia } from "elysia";

import { userModel } from "../models/user";
import {
  AccountsService,
  InvalidEmailPasswordError,
} from "../services/accounts";

export const sessionsController = new Elysia()
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
  );
