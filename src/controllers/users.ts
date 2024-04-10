import { Elysia } from "elysia";

import { userModel } from "../models/user";
import { AccountsService } from "../services/accounts";
import { authService } from "../services/auth";

export const usersController = new Elysia({ prefix: "/users" })
  .use(authService)
  .use(userModel)
  // GET /users
  .get("/", async ({ user, error }) => {
    if (!user) return error(401, { error: "Unauthorized" });

    const users = await AccountsService.getAllUsers();
    return { items: users };
  })
  // GET /users/:id
  .get(
    "/:id",
    async ({ user: usr, params: { id }, error }) => {
      if (!usr) return error(401, { error: "Unauthorized" });

      const user = await AccountsService.getUserById(id);
      if (!user) return error(404, { error: "User not found" });
      return { user };
    },
    {
      params: "user.get",
    },
  );
