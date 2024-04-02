import { Elysia } from "elysia";

import { userModel } from "../models/user";
import { AccountService } from "../services/account";

export const usersController = new Elysia({ prefix: "/users" })
  .use(userModel)
  .post(
    "/",
    async ({ body: { email, password }, error }) => {
      const { user, error: err } = await AccountService.createUser(
        email,
        password,
      );
      if (err) return error(400, { error: err });
      const { hashedPassword, ...userWithoutPassword } = user;
      return { user: userWithoutPassword };
    },
    {
      body: "user.create",
    },
  )
  .get("/", async () => {
    const users = await AccountService.getAllUsers();
    return { items: users };
  })
  .get(
    "/:id",
    async ({ params: { id }, error }) => {
      const user = await AccountService.getUserById(id);
      if (!user) return error(404, { error: "User not found" });
      return { user };
    },
    {
      params: "user.get",
    },
  )
  .delete(
    "/:id",
    async ({ params: { id }, error }) => {
      const deletedUser = await AccountService.deleteUserById(id);
      if (!deletedUser) return error(404, { error: "User not found" });
      return { id: deletedUser.id };
    },
    {
      params: "user.get",
    },
  );
