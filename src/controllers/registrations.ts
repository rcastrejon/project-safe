import Elysia from "elysia";

import { userModel } from "../models/user";
import {
  AccountsService,
  EmailInUseError,
  InvalidInvitationError,
} from "../services/accounts";

export const registrationsController = new Elysia()
  .use(userModel)
  // POST /sign-up
  // Auth: none
  .post(
    "/sign-up",
    async ({ body, error }) => {
      try {
        const user = await AccountsService.registerUser(body);
        const session = await AccountsService.generateUserSession(user);
        return { session };
      } catch (e) {
        if (e instanceof InvalidInvitationError) {
          return error(400, { error: e.message });
        }
        if (e instanceof EmailInUseError) {
          return error(400, { error: e.message });
        }
      }
    },
    {
      body: "user.sign-up",
      transform({ body }) {
        body.email = body.email?.toLowerCase();
      },
    },
  );
